import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Whatsapp = () => {
    const handleClick = async () => {
        try {
            const response = await fetch("http://localhost:4000/api/whatsapp/sendTemplateMessage", {
                method: "GET",
            });
            if (response.ok) {
                console.log("Message sent successfully");
                
                // Show success popup
                Swal.fire({
                    icon: 'success',
                    title: 'Congratulations!',
                    text: "You've contacted us. We will reply to your response ASAP. If you want to send more messages. Please open your whatsapp. You will find us in your latest message.",
                    confirmButtonText: 'OK'
                });
            } else {
                console.error("Failed to send message");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <Link>
            <img
                className="w-16 fixed z-50 bottom-10 right-10 cursor-pointer"
                src="./whatsapp-logo.png"
                alt="WhatsApp Logo"
                onClick={handleClick}
            />
        </Link>
    );
};

export default Whatsapp;
