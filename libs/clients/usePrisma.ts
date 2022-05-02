const usePrisma = () => {
  const convertDate = (date: Date) => {
    const receivedDate = new Date(date);
    const years = receivedDate.getFullYear();
    const months = String(receivedDate.getMonth() + 1).padStart(2, "0");
    const days = String(receivedDate.getDate()).padStart(2, "0");
    const hours = String(receivedDate.getHours()).padStart(2, "0");
    const minutes = String(receivedDate.getMinutes()).padStart(2, "0");

    return `${years}-${months}-${days}, ${hours}:${minutes}`;
  };
  return {
    convertDate,
  };
};

export default usePrisma;
