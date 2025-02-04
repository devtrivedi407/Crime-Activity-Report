from flask import Flask, request, jsonify, send_file, send_from_directory
import pandas as pd
import matplotlib.pyplot as plt
import os
from fpdf import FPDF
from flask_cors import CORS
import matplotlib

# ✅ Fix Matplotlib GUI Issue
matplotlib.use('Agg')  # Use a non-GUI backend to prevent threading issues

app = Flask(__name__, static_folder="generated_reports")  # ✅ Serve static files
CORS(app)

# ✅ Set Directories
REPORTS_DIR = "generated_reports"
os.makedirs(REPORTS_DIR, exist_ok=True)

# ✅ Load Crime Data
CSV_PATH = "CSV Datasets/cleaned_crime_data.csv"
crime_data = pd.read_csv(CSV_PATH)

# ✅ Dropdown Data for Front-End
@app.route('/get-dropdown-options', methods=['GET'])
def get_dropdown_options():
    return jsonify({
        "states": sorted(crime_data['State'].dropna().unique().tolist()),
        "years": sorted(crime_data['Year'].dropna().astype(str).unique().tolist()),
        "crime_types": sorted(crime_data['Crime Type'].dropna().unique().tolist())
    })

# ✅ PDF Report Generation Route
@app.route('/generate-report', methods=['GET'])
def generate_report():
    state = request.args.get('state', '')
    year = request.args.get('year', '')
    crime_type = request.args.get('crimeType', '').lower()

    df_filtered = crime_data.copy()
    if state:
        df_filtered = df_filtered[df_filtered['State'] == state]
    if year:
        df_filtered = df_filtered[df_filtered['Year'] == int(year)]
    if crime_type:
        df_filtered = df_filtered[df_filtered['Crime Type'].str.lower().str.contains(crime_type)]

    if df_filtered.empty:
        return jsonify({'success': False, 'message': 'No data found'})

    pdf_filename = "crime_report.pdf"
    pdf_path = os.path.join(REPORTS_DIR, pdf_filename)
    
    generate_pdf(df_filtered, pdf_path)

    return jsonify({'success': True, 'pdf_url': f"http://127.0.0.1:5000/reports/{pdf_filename}"})

# ✅ Generate PDF Function
def generate_pdf(df, filename):
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Arial", "B", 16)
    pdf.cell(200, 10, "Crime Report", ln=True, align='C')
    pdf.ln(10)

    pdf.set_font("Arial", size=12)
    for _, row in df.iterrows():
        pdf.cell(200, 10, f"{row['State']} - {row['Year']} - {row['Crime Type']} - {row['Crime Count']}", ln=True)

    pdf.output(filename)

# ✅ Serve PDF Reports
@app.route('/reports/<path:filename>')
def download_pdf(filename):
    return send_from_directory(REPORTS_DIR, filename, as_attachment=True)

# ✅ Graph Generation Route# ✅ Fix Matplotlib GUI Issue
# ✅ New Route to Serve Generated Graphs

@app.route('/generated_reports/<filename>')
def serve_generated_image(filename):
    return send_from_directory(REPORTS_DIR, filename)

@app.route("/generate-graph")
def generate_graph():
    graph_type = request.args.get("graphType")
    state = request.args.get("state")
    year = request.args.get("year")
    crime_type = request.args.get("crimeType")

    img_path = os.path.join(REPORTS_DIR, "generated_graph.png")

    # ✅ Filter Data
    df = crime_data.copy()
    if state != "all":
        df = df[df["State"] == state]
    if year != "all":
        df = df[df["Year"] == int(year)]
    if crime_type != "all":
        df = df[df["Crime Type"] == crime_type]

    if df.empty:
        return jsonify({"error": "No data available for selected criteria"}), 400

    graph_data = df.groupby("Year")["Crime Count"].sum()

    # ✅ Create Figure
    plt.figure(figsize=(10, 6))
    try:
        if graph_type == "bar":
            graph_data.plot(kind="bar", color="royalblue")
        elif graph_type == "pie":
            graph_data.plot(kind="pie", autopct='%1.1f%%', startangle=90, colormap="tab10")
        elif graph_type == "line":
            graph_data.plot(kind="line", marker="o", linestyle="-", color="crimson")
        elif graph_type == "scatter":
            plt.scatter(graph_data.index, graph_data.values, color="green", s=100)
        else:
            return jsonify({"error": "Invalid graph type"}), 400

        plt.title(f"{crime_type} in {state} ({year})")
        plt.xlabel("Year")
        plt.ylabel("Crime Count")
        plt.grid(True)

        plt.savefig(img_path)
        plt.close()

        # ✅ Ensure File Exists
        if not os.path.exists(img_path):
            return jsonify({"error": "Graph file was not created"}), 500

        print("✅ Graph successfully created:", img_path)
        return jsonify({"success": True, "image_url": f"http://127.0.0.1:5000/generated_reports/generated_graph.png"})

    except Exception as e:
        return jsonify({"error": f"Graph generation failed: {str(e)}"}), 500

# ✅ Run Flask Application
if __name__ == '__main__':
    app.run(debug=True)
