import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div className="home">
            <section className="hero">
            {/* PNG Designed By niazmorshed from https://pngtree.com/freepng/sneakers-running-fashion-sports-shoe_16213982.html?sol=downref&id=bef */}
                <img className=" hero-image" src="/assets/img/hero.png" />
                <div className="hero-intro">
                    <h2 className="text-9xl font-bold">Summer Collection</h2>
                    <h2 className="text-5xl mt-4 font-bold">2024</h2>
                    <p className="text-lg leading-relaxed mt-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi possimus similique, officiis molestias quae eaque maiores asperiores reiciendis eius ut recusandae debitis. Dolorem ducimus laborum molestias porro minima qui possimus.
                    Fuga ipsum fugit unde temporibus, quaerat soluta praesentium veniam eveniet libero aut nostrum non qui? Sunt perferendis corrupti voluptatibus. Sunt sit doloribus illo dignissimos non excepturi incidunt optio ut ab.</p>
                    <Button className="call-to-action mt-8 rounded font-bold" size={"lg"}>SHOP NOW</Button>
                </div>
            </section>
        </div>
    );
}
