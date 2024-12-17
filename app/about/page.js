import React from 'react';

const AboutPage = () => {
    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-center font-bold text-3xl mb-5">About Us</h1>
            <div className="bg-[#575669] bg-opacity-40 p-10 rounded mb-4 w-2/3 font-serif">
                <p className="text-center">OtakuHub is your go-to website for all your anime recommendations to fulfill your cravings according to your preference.</p>
                <p className='text-center'>We are passionate about bringing the best anime content to fans around the world.</p> 
                <p className='text-center'>Designed for Anime lovers and watchers, this platform allows you to find anime recommendations based on the genres of your choice.</p>
            </div> 
            
            <h2 className="text-center font-bold text-xl mb-4">Contact Us</h2>
            <div className="flex items-center bg-[#575669] bg-opacity-50 p-4 rounded">
                <span>otakuhub@gmail.com</span>
            </div>
        </div>
    );
};

export default AboutPage;