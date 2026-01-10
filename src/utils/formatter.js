export const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

export const formatDate = (isoDate) => {
  const date = new Date(isoDate);

  const dateOptions = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = date.toLocaleDateString("id-ID", dateOptions);

  const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: false };
  const formattedTime = date.toLocaleTimeString("id-ID", timeOptions);

  return `${formattedDate} ${formattedTime} WIB`;
};
