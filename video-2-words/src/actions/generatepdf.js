import { jsPDF } from "jspdf";

export async function generatePDF(text,fileName,showToast) {

    if (!fileName) return;
  
    const pdf = new jsPDF();
  
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.setLineWidth(2);
    pdf.setDrawColor(0, 128, 255); 
    pdf.rect(10, 10, pageWidth - 20, pageHeight - 20, "S");

    pdf.setFontSize(24);
    pdf.setTextColor(0, 0, 128);
    pdf.text("Video Transcript", pageWidth / 2, 30, { align: "center" });

    pdf.setFontSize(14);
    pdf.setTextColor(50, 50, 50);
    pdf.text(text, 20, 60, { maxWidth: pageWidth - 40, align: "justify" });

    pdf.setFontSize(10);
    pdf.setTextColor(128, 0, 128);
    pdf.text(`Video2Words | Made with Love by Vigneshwaran Balamurugan`, parseFloat(pageWidth)/2 , pageHeight - 13, { align: "center" });

    pdf.save(`${fileName}.pdf`);
    showToast(`${fileName} saved successfully..!`,"success");
  }
  