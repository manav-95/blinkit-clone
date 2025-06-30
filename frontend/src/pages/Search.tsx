
const Search = () => {

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Recent Searches */}
        <div className="flex justify-between items-center">
          <h1 className="font-gilroy text-lg text-gray-800">Recent Searches</h1>
          <button className="text-[#318616] font-medium">clear</button>
        </div>
        <div className="flex space-x-4 text-nowrap">
          <button className="border shadow-sm px-4 py-1 rounded-lg text-sm font-[450] text-gray-600 my-4">
            wwe 2k24
          </button>
        </div>
      </div>
    </>
  )
}

export default Search