import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportExcelOptions {
  data: any[];
  filename: string;
  sheetName?: string;
}

interface ExportPDFOptions {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: any[][];
  filename: string;
  churchName?: string;
}

/**
 * Exporte des données JSON au format Microsoft Excel (.xlsx)
 */
export function exportToExcel({ data, filename, sheetName = "Données" }: ExportExcelOptions) {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Ajustement automatique de la largeur des colonnes
    const maxCols = data.reduce((acc: Record<string, number>, row) => {
      Object.keys(row).forEach((key) => {
        const valStr = row[key] ? String(row[key]) : "";
        acc[key] = Math.max(acc[key] || 0, valStr.length, key.length);
      });
      return acc;
    }, {});
    
    worksheet["!cols"] = Object.keys(maxCols).map((key) => ({
      wch: maxCols[key] + 3, // marge de 3 caractères
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Déclenche le téléchargement du fichier xlsx
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  } catch (error) {
    console.error("Erreur lors de l'export Excel :", error);
  }
}

/**
 * Exporte un tableau de données au format Adobe PDF (.pdf) avec un en-tête aux couleurs des AD Côte d'Ivoire
 */
export function exportToPDF({
  title,
  subtitle,
  headers,
  rows,
  filename,
  churchName = "Assemblées de Dieu de Côte d'Ivoire",
}: ExportPDFOptions) {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;

    // En-tête : Bandeau bleu royal
    doc.setFillColor(13, 31, 92); // #0D1F5C (Bleu profond)
    doc.rect(0, 0, pageWidth, 25, "F");

    // Texte en-tête blanc
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(churchName.toUpperCase(), 15, 12);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(212, 168, 67); // #D4A843 (Or)
    doc.text("GESTION FINANCIÈRE & TRÉSORERIE", 15, 18);

    // Date d'édition à droite dans l'en-tête
    doc.setTextColor(255, 255, 255);
    const dateStr = new Date().toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    doc.text(`Édité le : ${dateStr}`, pageWidth - 15, 15, { align: "right" });

    // Titre du document
    doc.setTextColor(13, 31, 92); // Retour au bleu profond
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, 15, 38);

    // Sous-titre
    if (subtitle) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // Gris ardoise
      doc.text(subtitle, 15, 44);
    }

    // Ligne décorative dorée sous le titre
    doc.setDrawColor(212, 168, 67); // Or
    doc.setLineWidth(0.6);
    doc.line(15, 48, pageWidth - 15, 48);

    // Génération du tableau avec jspdf-autotable
    autoTable(doc, {
      startY: 54,
      head: [headers],
      body: rows,
      theme: "striped",
      headStyles: {
        fillColor: [13, 31, 92], // Bleu profond
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
        halign: "left",
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [51, 65, 85],
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252], // Gris très doux
      },
      margin: { top: 30, right: 15, bottom: 20, left: 15 },
      didDrawPage: (data) => {
        // Pied de page : Numérotation
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        
        // Mentions légales bas de page
        doc.text(
          "Document officiel généré par EgliseFinance AD-CI. Tous droits réservés.",
          15,
          pageHeight - 10
        );
        
        const str = `Page ${data.pageNumber}`;
        doc.text(str, pageWidth - 15, pageHeight - 10, { align: "right" });
      },
    });

    // Sauvegarde du fichier
    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Erreur lors de l'export PDF :", error);
  }
}
