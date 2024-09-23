export default function FeaturedProducts() {
    const products = [
        {
            id: 1,
            imageAlt: "product image",
            imageSrc: "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/a0ecccf5b6b696d9f18cc8d6b19baf90.jpg",
            href: "#",
            name: "Men's sneaker",
            color: "white",
            price: "20",
        },
        {
            id: 2,
            imageAlt: "product image",
            imageSrc: "https://m.media-amazon.com/images/I/61obzQCZ9rL._AC_UL480_FMwebp_QL65_.jpg",
            href: "#",
            name: "Men's sneaker",
            color: "white",
            price: "20",
        },
        {
            id: 3,
            imageAlt: "product image",
            imageSrc: "https://m.media-amazon.com/images/I/81axS2m8f3L._AC_UL480_FMwebp_QL65_.jpg",
            href: "#",
            name: "Men's sneaker",
            color: "white",
            price: "20",
        },
        {
            id: 4,
            imageAlt: "product image",
            imageSrc: "https://m.media-amazon.com/images/I/71DGLwIueyL._AC_UL480_FMwebp_QL65_.jpg",
            href: "#",
            name: "Men's sneaker",
            color: "white",
            price: "20",
        }
    ];
    // aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80
    // h-full w-full object-cover object-center lg:h-full lg:w-full
    return (
        <div className="w-full border-b md:border-0 rotate-0 scale-100 transition-all dark:-rotate-0 dark:scale-100">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-bold tracking-tight">Best Products For You!</h2>

                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <div key={product.id} className="group">
                            <a href={product.href}>
                                <div className="overflow-hidden rounded-md">
                                    <img
                                        width={"250"}
                                        height={"330"}
                                        alt={product.imageAlt}
                                        src={product.imageSrc}
                                        className="h-auto w-auto object-cover transition-on-all hover:scale-110 aspect-[3/3]  delay-100 duration-100 ease-in-out"
                                    />
                                </div>
                                <div className="mt-4 flex justify-between">
                                    <div>
                                        <h3 className="text-lg">
                                            {product.name}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                                    </div>
                                    <p className="text-2xl font-medium"><span className="text-base font-bold">$ </span>{product.price}</p>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}