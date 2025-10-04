import { useState } from "react";
import { Helmet } from "react-helmet"; // ✅ Import Helmet

const ManageOtherCard = () => {
  const [cards] = useState([
    {
      id: 1,
      img: "/safara1.jpg",
      title: "Luxury Residential Complex",
      description:
        "A state-of-the-art residential project featuring modern amenities and breathtaking views. Perfect for families and individuals seeking luxury living.",
    },
    {
      id: 2,
      img: "/safara1.jpg",
      title: "Commercial Office Space",
      description:
        "An innovative and high-tech office space for businesses looking for a dynamic and collaborative work environment. Strategically located for convenience.",
    },
    {
      id: 3,
      img: "/safara2.jpg",
      title: "Eco-Friendly Housing Development",
      description:
        "A sustainable and green residential project focused on energy efficiency, eco-friendly materials, and a harmonious connection with nature.",
    },
    {
      id: 4,
      img: "/safara2.jpg",
      title: "Luxury Villas by the Beach",
      description:
        "Exclusive beachfront villas offering panoramic ocean views, private pools, and luxurious amenities for those who seek the ultimate in relaxation and privacy.",
    },
    {
      id: 5,
      img: "/safara2.jpg",
      title: "Urban Mixed-Use Complex",
      description:
        "A vibrant community blending residential, commercial, and retail spaces. Perfectly designed for city living with easy access to everything you need.",
    },
    {
      id: 6,
      img: "/safara2.jpg",
      title: "Affordable Housing Project",
      description:
        "A budget-friendly housing solution aimed at providing quality living for families and individuals without compromising on comfort and safety.",
    },
  ]);

  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (card) => setSelectedCard(card);
  const closeModal = () => setSelectedCard(null);

  return (
    <div className="container mx-auto p-6 bg-gray-100">
      {/* ✅ Helmet for page title and meta */}
      <Helmet>
        <title>Our Other Projects - Safara</title>
        <meta
          name="description"
          content="Explore Safara's other projects, including luxury residential complexes, commercial office spaces, eco-friendly housing developments, and more."
        />
      </Helmet>

      <h1 className="text-4xl font-extrabold mb-8 text-center text-primary">
        Our Other Projects
      </h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {cards.map((card) => (
          <div
            key={card.id}
            className="card bg-white shadow-xl rounded-lg overflow-hidden transform hover:scale-105 transition duration-300 cursor-pointer"
            onClick={() => handleCardClick(card)}
          >
            <img
              src={card.img}
              alt={card.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                {card.title}
              </h3>
              <p className="text-gray-600">{card.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedCard && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96 transform transition-all duration-500 ease-in-out scale-100 opacity-100">
            <h2 className="text-3xl font-bold text-indigo-600 mb-4">
              {selectedCard.title}
            </h2>
            <img
              src={selectedCard.img}
              alt={selectedCard.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-gray-700 mb-6">{selectedCard.description}</p>
            <button
              onClick={closeModal}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOtherCard;
