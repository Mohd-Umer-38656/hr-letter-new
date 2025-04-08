"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";


import {
  PDFDownloadLink,
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

export default function Letters() {
  const [template, setTemplate] = useState(null); // Stores template data fetched from API
  const [formData, setFormData] = useState({}); // Stores user input values for placeholders
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]); // Stores employee data fetched from API
  const params = useParams(); // Get the template ID from the URL params
  const id = params?.id;

 
  useEffect(() => {
    if (!id) return;

    fetch(`/api/templates/${id}`) // Fetch template details using the ID
      .then((res) => res.json())
      .then((data) => {
        // console.log("Fetched Template Data:", data);

        const parsedPlaceholders = JSON.parse(data.placeholders || "{}"); // Parse placeholders JSON

        setTemplate({ ...data, placeholders: parsedPlaceholders });
        setFormData(parsedPlaceholders); // Initialize form data with placeholders
      })
      .catch((error) => console.error("Error fetching template:", error));
  }, [id]);


  // 
  useEffect(() => {
    fetch("/api/emp") // Fetch all employees data
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);


  // here are serching and filling the employee data in the form
  // Handle search input changes
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    
    const employee = employees.find(emp =>
      emp.id.toString() === value || emp.name?.toLowerCase().includes(value)
    );
    // console.log(employee);
    if (employee) {
      setFormData((prev) => ({
        ...prev,
        Name: employee.name || "",
        "Employee ID": employee.id || "",
        Position: employee.position || "",
      }));
    }
  };
////////////////////////
  

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



//Saving the template data for the reference

const handleSaveLetter = async () => {
  const response = await fetch("/api/template-hist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      template_id: id, // Template ID
      template_name: template.name, // Template Name (Offer Letter, etc.)
      form_data: formData, // Object containing user input
    }),
  });

  const result = await response.json();
  if (result.success) {
    toast.success("Letter saved successfully!"); // Success Notification
  } else {
    toast.error("Failed to save letter!"); //Error Notification
  }
};



//////////////////////

  if (!template) return <p>Loading...</p>; // Show loading text if template is not yet fetched

  return (
    
    <div style={styles.container} className="contain">
        <ToastContainer position="bottom-right" autoClose={3000} />
      {/* Left panel for user input */}
      <div style={styles.leftPanel} className="left">


        {/* search bar for employee search */}
<input
          type="text"
          placeholder="Search by Name or ID"
          value={searchTerm}
          onChange={handleSearch}
          style={styles.input}
        />
      <hr className="h-px  bg-red-200 border-0 dark:bg-blue-700"></hr>
        <hr />

        <h2 style={styles.heading}>{template.formTitle || "Enter Details"}</h2>

 

        {Object.keys(template.placeholders).map((key) => (
          <input  // we can change with textArea for better form filling
            key={key}
            type={key.toLowerCase().includes("date") ? "date" : "text"}
            name={key}
            placeholder={key}
            value={formData[key] || ""}
            onChange={handleChange}
            style={styles.input}
          />
        ))}

        {/* PDF Download Button */}
        <PDFDownloadLink
          document={<PDFDocument template={template} formData={formData} />}
          fileName={`${template.name}.pdf`}
        >
          {({ loading }) => (
            <button style={styles.button} onClick={handleSaveLetter}>
             
              {loading ? "Generating PDF..." : "Download PDF"}
            </button>
          )}
        </PDFDownloadLink>
    

      </div>

      {/* Right panel for template preview */}

      <div style={styles.preview} className="right">
        <PDFViewer width="100%" height="500px">
          <PDFDocument template={template} formData={formData} />
        </PDFViewer>
      </div>
    </div>
  );
}

// PDF Document Component main part
function PDFDocument({ template, formData }) {
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <Image src="/logo.png" style={pdfStyles.logo} />

          <View style={pdfStyles.middleText}>
            <Text style={pdfStyles.companyTitle}>EINFRATECH SYSTEMS INDIA</Text>
            <Text style={pdfStyles.tagline}>Make Better Work-Infra</Text>
          </View>

          <View style={pdfStyles.companyDetails}>
            <Text style={pdfStyles.companyName}>Einfratech Systems</Text>
            <Text>Hustlehub Tech Park,</Text>
            <Text>ITI Layout, Sector 2, HSR Layout,</Text>
            <Text>Bengaluru, India - 560102</Text>
            <Text>https://einfratechsys.com/</Text>
          </View>
        </View>
        <Text style={pdfStyles.title}>{template.name}</Text>
        <Text style={pdfStyles.date}>
          Date: {new Date().toISOString().split("T")[0]}
        </Text>

        {/* Replace placeholders with user input values in the PDF content */}
        <Text style={pdfStyles.content}>
          {template.content.split(/(\[.*?\])/g).map((part, index) =>
            part.startsWith("[") && part.endsWith("]") ? (
              <Text key={index} style={pdfStyles.bold}>
                {formData[part.slice(1, -1)] || part}
              </Text>
            ) : (
              <Text key={index}>{part}</Text>
            )
          )}
        </Text>

        <Image src="/sign.png" style={pdfStyles.signature} />
        <Text style={pdfStyles.hr}>For EINFRATECH SYSTEMS</Text>
        <Text style={pdfStyles.hr}>HR Head</Text>
      </Page>
    </Document>
  );
}

const styles = {
  container: { display: "flex", gap: "20px", padding: "40px" },
  leftPanel: {
    width: "30%",
    padding: "20px",
    background: "#f8f8f8",
    borderRadius: "8px",
  },
  preview: {
    width: "70%",
    padding: "40px",
    background: "#fff",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  heading: { fontSize: "20px", marginBottom: "10px" },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Times-Roman",
    backgroundImage: "url('/logo.png')",
    backgroundSize: "cover",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logo: { width: 80, height: 80 },
  middleText: { textAlign: "center", flexGrow: 1 },
  companyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A90E2",
    marginLeft: 20,
  },
  tagline: { fontSize: 10, color: "#666", marginLeft: 20 },
  companyDetails: { textAlign: "right", fontSize: 12 },
  companyName: { fontSize: 14, fontWeight: "bold" },
  title: {
    fontSize: 18,
    textAlign: "center",
    textTransform: "uppercase",
    textDecoration: "underline",
    marginBottom: 30,
    marginTop: 20,
    fontWeight: "bold",
  }, // Title bold
  date: {
    fontSize: 12,
    textAlign: "left",
    marginBottom: 10,
    fontWeight: "bold",
  }, // Date moved left
  content: {
    fontSize: 12,
    lineHeight: 1.5,
    marginBottom: 20,
  },
  placeholder: { fontWeight: "bold" }, // Make placeholders bold
  signature: { width: 100, height: 50, marginTop: 20 },
  hr: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "left", // HR Head near the signature
    marginLeft: 20,
  },
  bold: {
    fontWeight: "bold", // Bold style for user inputs
  },
});

