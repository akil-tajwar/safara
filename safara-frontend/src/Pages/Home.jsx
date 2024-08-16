
const Home = () => {
    return (
        <div className="w-3/4 mx-auto">
            <div className="grid grid-cols-2 gap-20 items-center">
                <div>
                    <div>
                        <h3 className="text-6xl font-semibold">Best learning Platform</h3>
                        <h3 className="text-6xl font-semibold text-[#125ca6]">In the world</h3>
                    </div>
                    <p className="my-5 text-justify">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatibus, praesentium. Molestias ipsa debitis eaque laudantium libero magni. Perferendis vel sequi velit in voluptas deleniti praesentium, exercitationem optio nisi dicta ea?</p>
                    <button className="bg-[#125ca6] text-white px-3 py-2 rounded-md font-semibold">Get Started</button>
                </div>
                <div>
                    <img src="banner.png" alt="" />
                </div>
            </div>
        </div>
    );
};

export default Home;