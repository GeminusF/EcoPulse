export async function exportPdf(element: HTMLElement, filename: string) {
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: null,
    useCORS: true,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  // Header
  pdf.setFillColor(34, 197, 94);
  pdf.rect(0, 0, pdfWidth, 18, 'F');
  pdf.setTextColor(255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('EcoPulse Report', 10, 12);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text(new Date().toLocaleDateString(), pdfWidth - 30, 12);

  // Content
  pdf.addImage(imgData, 'PNG', 5, 22, pdfWidth - 10, pdfHeight - 10);

  pdf.save(`${filename}.pdf`);
}

export async function exportChartAsPng(element: HTMLElement, filename: string) {
  const { default: html2canvas } = await import('html2canvas');
  const canvas = await html2canvas(element, { scale: 2, backgroundColor: null, useCORS: true });
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
