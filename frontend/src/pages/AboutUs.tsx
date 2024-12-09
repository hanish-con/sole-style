import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

const AboutUs: React.FC = () => {
  const teamMembers = [
    { name: "Sreelakshmi Thottupurath Jayachandran", title: "Chief Executive Officer (CEO)", image: "assets/img/sreelakshmi.jpg" },
    { name: "Yash Paragkumar Patel", title: "Chief Technology Officer (CTO)", image: "assets/img/yash.jpg" },
    { name: "Hanish Kavalanchery Haridas", title: "Chief Design Officer (CDO)", image: "assets/img/hanish.jpg" },
  ];

  return (
    <div className="min-h-screen p-8 flex flex-col items-center space-y-6">
      <Heading title="About SoleStyle" description="Get to know us better and discover our journey." />

      {/* Mission and Vision */}
      <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-5/4">
        <Card className="w-full lg:w-1/2 p-6">
          <CardHeader className="text-xl font-bold">Our Mission</CardHeader>
          <CardContent>
            <p>
              To deliver stylish, comfortable, and sustainable footwear, providing a delightful shopping experience for every customer.
            </p>
          </CardContent>
        </Card>

        <Card className="w-full lg:w-1/2 p-6">
          <CardHeader className="text-xl font-bold">Our Vision</CardHeader>
          <CardContent>
            <p>
              To lead the global footwear market by setting benchmarks in design, technology, and customer engagement.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Journey */}
      <div className="w-full lg:w-5/4">
        <Card className="p-6">
          <CardHeader className="text-xl font-bold">Our Journey</CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold">2024</h3>
                <p>Launch: Introducing SoleStyle to redefine the footwear shopping experience.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold">2025</h3>
                <p>Growth: Expanded our operations globally, winning the hearts of our customers.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold">Future</h3>
                <p>Innovation: Pioneering cutting-edge technologies and trends in the footwear industry.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team */}
      <div className="w-full lg:w-5/4">
        <Card className="p-6">
          <CardHeader className="text-xl font-bold">Meet Our Team</CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member) => (
                <div key={member.name} className="flex flex-col items-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mb-4"
                  />
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.title}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <div className="w-full lg:w-5/4">
        <Card className="p-6">
          <CardHeader className="text-xl font-bold">Our Achievements</CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="text-center">
                <h3 className="text-2xl font-bold">900+</h3>
                <p className="text-gray-600">Products Available</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold">5346+</h3>
                <p className="text-gray-600">Happy Customers</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold">70+</h3>
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
