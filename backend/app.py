from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import uuid

app = Flask(__name__)
CORS(app)

# --- LAYER 3 MOCKS ---

def pattern_analyzer(user_id, message):
    """Mocks queries to Firebase for the user's last 30 days of messages.
    Counts drug mentions, frequency, and escalation trend.
    """
    msg_lower = message.lower()
    if 'ibuprofen' in msg_lower and 'days' in msg_lower:
        return {
            "repeat_count": 5,
            "freq_per_week": 7,
            "trend": "escalating",
            "score": "Medium",
            "reason": "5 days continuous use reported"
        }
    elif 'bleed' in msg_lower or 'chest' in msg_lower or 'vomit' in msg_lower:
        return {
            "repeat_count": 2,
            "freq_per_week": 2,
            "trend": "severe escalation",
            "score": "High",
            "reason": "Escalation in symptom severity"
        }
    return {
        "repeat_count": 0,
        "freq_per_week": 0,
        "trend": "stable",
        "score": "Low",
        "reason": "No concerning historical patterns"
    }

def gemini_ai(message):
    """Mocks the conversational brain. Returns structured safe guidance with confidence score."""
    msg_lower = message.lower()
    if 'ibuprofen' in msg_lower and 'days' in msg_lower:
        return {
            "guidance_text": "Taking ibuprofen continuously for more than a few days without a doctor's supervision can increase the risk of stomach bleeding and kidney issues.",
            "risk_flag": "Medium",
            "confidence": 0.89
        }
    elif 'bleed' in msg_lower or 'chest' in msg_lower or 'vomit' in msg_lower:
        return {
            "guidance_text": "These symptoms could indicate a severe medical emergency. Please seek immediate medical attention.",
            "risk_flag": "High",
            "confidence": 0.95
        }
    return {
        "guidance_text": "I understand. Please rest and stay hydrated. If symptoms persist, consider scheduling a telehealth appointment.",
        "risk_flag": "Low",
        "confidence": 0.98
    }

def fda_drug_api(message):
    """Mocks checking every drug mentioned against real interaction database."""
    msg_lower = message.lower()
    if 'ibuprofen' in msg_lower and 'days' in msg_lower:
        return {
            "interaction_found": True,
            "severity": "Moderate",
            "reason": "NSAID prolonged use warning"
        }
    return {
        "interaction_found": False,
        "severity": "None",
        "reason": "No negative interactions found"
    }

# --- LAYER 4: Risk Aggregator ---

def risk_aggregator(pattern, ai, fda):
    """Takes three inputs and computes a final score."""
    score_weights = {"Low": 1, "Medium": 2, "High": 3}
    
    # Simple logic: max of the three
    p_score = score_weights.get(pattern["score"], 1)
    a_score = score_weights.get(ai["risk_flag"], 1)
    
    f_score_val = 1
    if fda["severity"] == "Moderate": f_score_val = 2
    elif fda["severity"] == "Severe": f_score_val = 3
    
    max_score = max(p_score, a_score, f_score_val)
    
    reasons = []
    if p_score > 1: reasons.append(f"Pattern Analyzer: {pattern['reason']}")
    if a_score > 1: reasons.append(f"Gemini Flag: Triage escalation intent detected" if a_score == 3 else "Gemini Flag: Caution advised")
    if f_score_val > 1: reasons.append(f"FDA Flag: {fda['reason']}")
    
    if max_score >= 3:
        return "High", reasons
    elif max_score == 2:
        return "Medium", reasons
    
    reasons.append("Safe guidance only provided")
    if fda["severity"] == "None": reasons.append(fda["reason"])
    return "Low", reasons

# --- LAYER 5: Escalation Logic ---

def execute_escalation(risk_level, message_data, reasons):
    """Determine what actions to trigger based on risk_level."""
    action_log = []
    if risk_level == "High":
        action_log.append("Alert sent to registered caregiver via SMS")
        action_log.append("Firebase push notification sent")
    elif risk_level == "Medium":
        action_log.append("Warning banner shown in chat")
    else:
        action_log.append("Normal safe guidance triggered")
    return action_log

# --- LAYER 2: Flask API Backend ---

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    if not data or 'message' not in data:
        return jsonify({"error": "No message provided"}), 400
        
    message = data['message']
    user_id = data.get('user_id', 'anonymous_' + str(uuid.uuid4())[:8])
    session_id = data.get('session_id', str(uuid.uuid4()))
    
    # Simulate processing delay slightly to show frontend typing indicators beautifully
    time.sleep(1.8)
    
    # Run parallel layer 3 calls (simulated sequentially here for simplicity)
    pattern_res = pattern_analyzer(user_id, message)
    ai_res = gemini_ai(message)
    fda_res = fda_drug_api(message)
    
    # Layer 4
    risk_level, reasons = risk_aggregator(pattern_res, ai_res, fda_res)
    
    # Layer 5
    actions = execute_escalation(risk_level, data, reasons)
    
    # Layer 6 output assembly
    response_data = {
        "id": str(uuid.uuid4()),
        "sender": "bot",
        "text": ai_res["guidance_text"],
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "riskBadge": {
            "level": risk_level.lower(),
            "reasons": reasons
        },
        "escalation_actions": actions
    }
    
    return jsonify(response_data)

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "status": "online",
        "message": "MediCheck AI Backend is running. Please use the React frontend at http://localhost:5173 to interact."
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
