import { Button } from "@/components/ui/button";
import FeaturedProducts from "./commons/featured_products";
import Brands from "./commons/brands";

export default function Home() {
    return (
        <div className="home">
            <section className="hero hidden">
                {/* PNG Designed By niazmorshed from https://pngtree.com/freepng/sneakers-running-fashion-sports-shoe_16213982.html?sol=downref&id=bef */}
                <img height={"300px"} width={"300px"} className=" hero-image" src="/assets/img/hero.png" />
                <div className="hero-intro">
                    <h2 className="text-9xl font-bold">Summer Collection</h2>
                    <h2 className="text-5xl mt-4 font-bold">2024</h2>
                    <p className="text-lg leading-relaxed mt-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi possimus similique, officiis molestias quae eaque maiores asperiores reiciendis eius ut recusandae debitis. Dolorem ducimus laborum molestias porro minima qui possimus.
                        Fuga ipsum fugit unde temporibus, quaerat soluta praesentium veniam eveniet libero aut nostrum non qui? Sunt perferendis corrupti voluptatibus. Sunt sit doloribus illo dignissimos non excepturi incidunt optio ut ab.</p>
                    <Button className="call-to-action mt-8 rounded font-bold" size={"lg"}>SHOP NOW</Button>
                </div>
            </section>
            <section className="hero2">
                <div className="hero-intro2">
                    <h2 className="text-5xl font-bold">Summer Collection</h2>
                    <h2 className="text-xl mt-4 font-bold text-pretty">Grab Upto 50% Off On Selected Sneakers</h2>
                    <Button className="call-to-action mt-8 rounded font-bold hover:bg-violet-600" size={"lg"}>SHOP NOW</Button>
                </div>
                <img height={"300px"} width={"300px"} className="hero-image2" src="/assets/img/hero.png" />
            </section>
            <section className="featured">
                <FeaturedProducts />
            </section>
            <Brands />
        </div>
    );
}
