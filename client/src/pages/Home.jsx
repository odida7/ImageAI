import React, {useState, useEffect} from 'react'
import {Loader, Card, FormField} from '../components'

const RenderCards = ({ data, title }) => {
  if(data?.length > 0) {
    return data.map((post)=> 
    <Card key={post._id} {...post} />)
    
  }
  return (
    <h2 className='mt-5 font-bold text-[#6449ff] texl-xl uppercase'>
      {title}
    </h2>
  )
}

export default function Home() {

  const [loading, setLoading] = useState(false)
  const [allPosts, setAllPosts] = useState(null) 
  const [searchText, setSearchText] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState(null);


  useEffect(()=>{
    const fetchPosts = async () => {
      setLoading(true);

      try{
        const response = await fetch('http://localhost:4000/api/v1/post', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if(response.ok) {
          const result = await response.json();
          setAllPosts(result.data.reverse());
        }

      }catch(error){
        alert(error)
      }finally{
        setLoading(false)
      }
    }
    fetchPosts();
  },[])

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResults = allPosts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase()));

        setSearchedResults(searchResults);
      }, 500),
    );
  };

 
  return (
    <section className='max-w-7x1 mx-auto flex flex-col w-400 lg:mx-20 sm:mx-1 xs:mx-1'>
      <div>
        <h1 className='font-extrabold text-[#322d2d] text-[32px]'>
          Art-Piece library
        </h1>

        <p className='mt-2 text-[gray] text-[16px] max-w-[900px]'>
          Explore collections of images and visually stunning art pieces generated by IMAGE-AI
        </p>
      </div>

      <div className='mt-16'>
        <FormField
          labelName="Search posts"
          type="text"
          name="text"
          placeholder="Search something..."
          value={searchText}
          handleChange={handleSearchChange}

        />
      </div>

      <div className='mt-10'>
        {loading ? (
          <div className='flex justify-center items-center'>
            <Loader/>
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className='font-medium text-[16px] text-[#666e75] text-xl mb-3'>
                Showing results for <span className='text-[#1d1c1c]'>{searchText}</span>
              </h2>
            )}

            <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3 font-medium'>
              {searchText ? (
                <RenderCards
                  data={searchedResults}
                  title='No search results found'
                  />
              ) : (
                <RenderCards
                data={allPosts}
                title='No posts found'
                />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
