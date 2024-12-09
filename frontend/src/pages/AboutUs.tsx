import React from "react";
import CountUp from "react-countup"; // Install this library using `npm install react-countup`
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

const AboutUs: React.FC = () => {
  const teamMembers = [
    { name: "Hanish Kavalanchery Haridas", title: "Chief Executive Officer (CEO)", image: "assets/img/hanish.jpg" },
    { name: "Yash Paragkumar Patel", title: "Chief Technology Officer (CTO)", image: "assets/img/yash.jpg" },
    { name: "Sreelakshmi Thottupurath Jayachandran", title: "Chief Design Officer (CDO)", image: "assets/img/sreelakshmi.jpg" },
  ];

  return (
    <div className="min-h-screen p-6 flex flex-col items-center space-y-6 bg-gray-50 text-center">
      <Heading
        title="About SoleStyle"
        description="Get to know us better and discover our journey."
      />

      {/* Mission and Vision */}
      <div className="flex flex-col lg:flex-row gap-6 w-full lg:w-4/5">
        <Card className="w-full lg:w-1/2 p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition">
          <CardHeader className="text-2xl font-semibold text-gray-800">
            Our Mission
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed">
              To deliver stylish, comfortable, and sustainable footwear, providing a
              delightful shopping experience for every customer.
            </p>
          </CardContent>
        </Card>

        <Card className="w-full lg:w-1/2 p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition">
          <CardHeader className="text-2xl font-semibold text-gray-800">
            Our Vision
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed">
              To lead the global footwear market by setting benchmarks in design,
              technology, and customer engagement.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Journey */}
      <div className="w-full lg:w-4/5">
        <Card className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition">
          <CardHeader className="text-2xl font-semibold text-gray-800">
            Our Journey
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-700">2024</h3>
                <p className="text-gray-600">
                  Launch: Introducing SoleStyle to redefine the footwear shopping
                  experience.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-700">2025</h3>
                <p className="text-gray-600">
                  Growth: Expanded our operations globally, winning the hearts of
                  our customers.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-700">Future</h3>
                <p className="text-gray-600">
                  Innovation: Pioneering cutting-edge technologies and trends in the
                  footwear industry.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team */}
      <div className="w-full lg:w-4/5">
        <Card className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition">
          <CardHeader className="text-2xl font-semibold text-gray-800">
            Meet Our Team
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="flex flex-col items-center bg-gray-100 p-4 rounded-lg hover:shadow-md transition"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mb-2"
                  />
                  <h3 className="text-md font-bold text-gray-800">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.title}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <div className="w-full lg:w-4/5">
        <Card className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition">
          <CardHeader className="text-2xl font-semibold text-gray-800">
            Our Achievements
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-6">
              <div className="text-center flex-1">
                <h3 className="text-3xl font-bold text-gray-800">
                  <CountUp end={900} duration={2} suffix="+" />
                </h3>
                <p className="text-gray-600">Products Available</p>
              </div>
              <div className="text-center flex-1">
                <h3 className="text-3xl font-bold text-gray-800">
                  <CountUp end={5346} duration={2.5} suffix="+" />
                </h3>
                <p className="text-gray-600">Happy Customers</p>
              </div>
              <div className="text-center flex-1">
                <h3 className="text-3xl font-bold text-gray-800">
                  <CountUp end={70} duration={1.5} suffix="+" />
                </h3>
                <p className="text-gray-600">Countries Reached</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutUs;
