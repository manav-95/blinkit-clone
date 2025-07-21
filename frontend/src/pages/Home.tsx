import ProductCarousel from "../components/ProductCarousel"

const Home = () => {
  const images = [
    "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/layout-engine/2023-07/pharmacy-WEB.jpg",
    "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/layout-engine/2023-07/Pet-Care_WEB.jpg",
    "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/layout-engine/2023-03/babycare-WEB.jpg",
  ]

  const categories = [
    { catName: 'Pann Corner', catImage: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-12/paan-corner_web.png', },
    { catName: 'Dairy, Bread & Eggs', catImage: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-2_10.png', },
    { catName: 'Fruits & Vegetables', catImage: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-3_9.png', },
    { catName: 'Cold Drink & Juices', catImage: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-4_9.png', },
    { catName: 'Snack & Munchies', catImage: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-5_4.png', },
    { catName: 'Breakfast & Instant Food', catImage: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-6_5.png', },
    { catName: 'Sweet Tooth', catImage: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-7_3.png', },
    { catName: 'Bakery & Biscuits', catImage: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-8_4.png', },
    { catName: 'Tea, Coffee & Health Drink', catImage: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-9_3.png', },
    { catName: 'Atta, Rice & Dal', catImage: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-10.png', },
    { catName: '', catImage: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-11.png', },
    { catName: '', catImage: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-12.png', },
    { catName: '', catImage: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-13.png', },
    { catName: '', catImage: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-14.png', },
    { catName: '', catImage: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-15.png', },
    { catName: '', catImage: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-16.png', },
    { catName: '', catImage: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-17.png', },
    { catName: '', catImage: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-18.png', },
    { catName: '', catImage: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-19.png', },
    { catName: '', catImage: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-20.png', },
  ]

  return (
    <>
      <div className="max-w-7xl mx-auto px-4">
        <div>
          <img src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=2700/layout-engine/2022-05/Group-33704.jpg" alt="long image" />
        </div>

        <div className="flex justify-between space-x-4 px-4 my-3">
          {images.map((item, index) => (
            <img
              key={index}
              src={item}
              alt="images"
              className="h-32 lg:h-44 xl:h-56"
            />
          ))}
        </div>

        <div className="grid lg:grid-cols-10 xl:grid-cols-10 gap-y-0">
          {categories.map((cat, index) => (
            <div key={index}>
              <img
                src={cat.catImage}
                alt={cat.catName}
                className=""
              />
            </div>
          ))}
        </div>

        <ProductCarousel category={"dairy & breakfast"} title={"Dairy, Bread & Eggs"} />
        {/* <ProductCarousel category={"candies & gums"} title={"Candies & Gums"} /> */}

      </div>
    </>
  )
}

export default Home