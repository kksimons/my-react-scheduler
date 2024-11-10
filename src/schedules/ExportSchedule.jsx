  // // Function to export schedule to PDF
  // const exportScheduleToPDF = async () => {
  //   const schedulerElement = document.getElementById("scheduler");
  //   if (!schedulerElement) {
  //     console.error("Scheduler element not found.");
  //     return;
  //   }

  //   const canvas = await html2canvas(schedulerElement);
  //   const imgData = canvas.toDataURL("image/png");
  //   const pdf = new jsPDF();
  //   const imgWidth = 190; // Set width of the image in the PDF
  //   const pageHeight = pdf.internal.pageSize.height;
  //   const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //   let heightLeft = imgHeight;

  //   let position = 0;

  //   pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
  //   heightLeft -= pageHeight;

  //   while (heightLeft >= 0) {
  //     position = heightLeft - imgHeight;
  //     pdf.addPage();
  //     pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
  //     heightLeft -= pageHeight;
  //   }

  //   pdf.save("Bussers_Schedule.pdf");
  // };