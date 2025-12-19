

const Signup = () => {
    return (
        <div className="flex w-full h-screen">
            <div className="w-1/2 h-full">
                <img src="trucks.jpg" alt="image of trucks" className="w-full h-full" />
            </div>
            <div className="w-1/2 flex justify-center items-center h-full">
                <div className="px-3 w-full min-h-96">
                    <form className="">
                        <div className="flex gap-2">
                            <label htmlFor="name" className="text-lg">Name</label>
                            <input type="text" id="name" placeholder="John Doe" className="border-0 border-b-2 border-black outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0" />
                        </div>
                        <div className="flex gap-2">
                            <label htmlFor="name" className="text-lg">Name</label>
                            <input type="text" id="name" placeholder="John Doe" className="border-0 border-b-2 border-black outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0" />
                        </div>



                        <div></div>
                        <div></div>
                        <div></div>
                    </form>
                </div>
            </div>
        </div >
    )
};

export default Signup; 
