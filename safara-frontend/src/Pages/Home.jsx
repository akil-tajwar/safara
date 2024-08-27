import useAuthContext from "../hooks/useAuthContext";
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';


// import required modules
import { Pagination } from 'swiper/modules';

const Home = () => {
  const { user } = useAuthContext();
  console.log("🚀 ~ Home ~ user:", user);

  return (
    <div className="w-3/4 mx-auto">
      <div className="grid grid-cols-2 gap-20 items-center">
        <div>
          <div>
            <h3 className="text-6xl font-semibold">Best learning Platform</h3>
            <h3 className="text-6xl font-semibold text-[#125ca6]">
              In the world
            </h3>
          </div>
          <p className="my-5 text-justify">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Voluptatibus, praesentium. Molestias ipsa debitis eaque laudantium
            libero magni. Perferendis vel sequi velit in voluptas deleniti
            praesentium, exercitationem optio nisi dicta ea?
          </p>
          <button className="bg-[#125ca6] text-white px-3 py-2 rounded-md font-semibold">
            Get Started
          </button>
        </div>
        <div>
          <img src="banner.png" alt="" />
        </div>
      </div>

      {/* learn more started  */}
      <div className="md:flex  mt-20">
        <div className="md:w-1/2">
          <div className="grid grid-cols-2  gap-y-2 ">
            <img src="/learn1.jpg" alt="" className="w-[250px] h-[150px] " />
            <img src="/learn2.jpg" alt="" className="w-[250px] h-[150px] " />
            <img src="/learn3.jpg" alt="" className="w-[250px] h-[150px] " />
            <img src="/learn4.jpg" alt="" className="w-[250px] h-[150px] " />
          </div>
        </div>
        <div className="md:w-1/2 ">
          <h1 className="text-[#125ca6] font-medium text-4xl mb-5">
            Learn More
          </h1>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Explicabo
            autem aperiam repellat quae ipsa? Sunt soluta necessitatibus iusto,
            corporis fugiat molestias repudiandae cum dolorum hic nam eum fugit.
            Quod cumque doloribus iste ab cupiditate ratione deserunt laboriosam
            harum architecto repellendus!
          </p>
        </div>
      </div>
      {/* lear more ended  */}

      {/* stat of user  */}
      <div className="mt-20 w-full ">
        <div className="stats shadow mx-auto w-full bg-[#125ca6] text-white">
          <div className="stat place-items-center">
            <div className="stat-title text-white">Users</div>
            <div className="stat-value">31K</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title text-white">Awards</div>
            <div className="stat-value text-secondary">4,200</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title text-white">Vip Users</div>
            <div className="stat-value">1,200</div>
          </div>
        </div>
      </div>

      {/* stat ended    */}

      {/* featureCard  */}

      <div className="mt-20 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-y-10 mb-20">
        {/* img1  */}
        <div>
          <img
            src="/learn1.jpg"
            alt=""
            className="w-[100px] h-[100px] rounded-xl"
          />
          <h3 className="font-medium text-2xl text-[#125ca6]">
            Intuitive Interface
          </h3>
          <p className="font-bold">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni,
            tempora.
          </p>
        </div>

        {/* img2 */}
        <div>
          <img
            src="/learn1.jpg"
            alt=""
            className="w-[100px] h-[100px] rounded-xl"
          />
          <h3 className="font-medium text-2xl text-[#125ca6]">
            Intuitive Interface
          </h3>
          <p className="font-bold">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni,
            tempora.
          </p>
        </div>

        {/* img3 */}
        <div>
          <img
            src="/learn1.jpg"
            alt=""
            className="w-[100px] h-[100px] rounded-xl"
          />
          <h3 className="font-medium text-2xl text-[#125ca6]">
            Intuitive Interface
          </h3>
          <p className="font-bold">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni,
            tempora.
          </p>
        </div>

        {/* img4  */}
        <div>
          <img
            src="/learn1.jpg"
            alt=""
            className="w-[100px] h-[100px] rounded-xl"
          />
          <h3 className="font-medium text-2xl text-[#125ca6]">
            Intuitive Interface
          </h3>
          <p className="font-bold">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni,
            tempora.
          </p>
        </div>

        {/* img5  */}
        <div>
          <img src="/learn1.jpg" alt="" className="w-[100px] h-[100px] " />
          <h3 className="font-medium text-2xl text-[#125ca6]">
            Intuitive Interface
          </h3>
          <p className="font-bold">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni,
            tempora.
          </p>
        </div>

        {/* img6 */}
        <div>
          <img src="/learn1.jpg" alt="" className="w-[100px] h-[100px] " />
          <h3 className="font-medium text-2xl text-[#125ca6]">
            Intuitive Interface
          </h3>
          <p className="font-bold">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni,
            tempora.
          </p>
        </div>
      </div>

      {/* featured ended  */}

  
    </div>
  );
};

export default Home;
