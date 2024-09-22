export default function FeaturedProducts() {
    const products = Array(4).fill(
        {
            id: 1,
            imageAlt: "product image",
            imageSrc: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg",
            href: "#",
            name: "Men's tees",
            color: "white",
            price: "20",
        }
    ).map(x => ({ ...x, id: (Math.random() * 100) }));
    // aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80
    // h-full w-full object-cover object-center lg:h-full lg:w-full
    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Best Products For You!</h2>

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
                                        className="h-auto w-auto object-cover transition-on-all hover:scale-110 aspect-[3/4]  delay-100 duration-100 ease-in-out"
                                    />
                                </div>
                                <div className="mt-4 flex justify-between">
                                    <div>
                                        <h3 className="text-sm text-gray-700">
                                            {/* <span aria-hidden="true" className="absolute inset-0" /> */}
                                            {product.name}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">{product.price}</p>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}