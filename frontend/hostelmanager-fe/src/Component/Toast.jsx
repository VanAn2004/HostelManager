import { useEffect } from "react";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const toastStyles = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };

  return (
    <div className={`fixed top-5 right-5 z-50 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 ${toastStyles[type]}`}>
      {message}
    </div>
  );
};

export default Toast;
