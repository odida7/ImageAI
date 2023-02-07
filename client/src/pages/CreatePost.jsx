import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { preview } from '../assets'
import { getRandomPrompt } from '../utils'
import { FormField, Loader } from '../components'

export default function CreatePost() {

  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  });
  const [generatingImg, setGeneratingImg] = useState(false)
  const [loading, setLoading] = useState(false)
  
 const generateImage = async ()=> {
    if(form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch('http://localhost:4000/api/v1/dalle',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: form.prompt,
          }),
        });

        const data = await response.json();

        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });

      } catch(err){
         alert(err);
      } finally {
        setGeneratingImg(false)
      } 
    }else {
        alert('Please enter a prompt');
      }
  };

  const handleSubmit = async (e)=> {
     e.preventDefault()

     if(form.prompt && form.photo) {
      setLoading(true)

      try {
        const response = await fetch('http://localhost:4000/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form)
        })

        await response.json();
        navigate('/');
      }catch(error){
        alert(error)
      }finally{
        setLoading(false)
      }
     } else{
      alert('Please enter a prompt')
     }
  }
  
  const handleChange = (e)=> { 
    setForm({...form, [e.target.name]: e.target.value})
  }

  const handleSurpriseMe = ()=> {
    const randomPrompt = getRandomPrompt(form.prompt)
    setForm({...form, prompt: randomPrompt})
  }
  

  return (
    <section className='flex flex-col w-400 lg:mx-20 sm:mx-1 xs:mx-1'>
       <h1 className='font-extrabold text-[#322d2d] text-[32px]'>
          Create
        </h1>

        <p className='mt-2 text-[gray] text-[16px] max-w-[900px]'>
          Create collections of images and visually stunning art pieces with Image-AI
        </p>

        <form className='mt-16 max-w-3x1' onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <FormField
              labelName='Your Name'
              type='text'
              name='name'
              placeholder='Name'
              value={form.name}
              handleChange={handleChange}
            />

            <FormField
              labelName='Prompt'
              type='text'
              name='prompt'
              placeholder='an astronaut lounging in a tropical resort in space, vaporwave'
              value={form.prompt}
              handleChange={handleChange}
              isSurpriseMe
              handleSurpriseMe={handleSurpriseMe}
            />

            <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focuse:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 justify-center items-center">
              {
                form.photo ? (
                  <img 
                    src={form.photo}
                    alt={form.prompt}
                    className='w-full h-full object-contain'
                  />
                ) : (
                  <img
                    src={preview}
                    alt='preview'
                    className='w-7/8 h-7/8 object-contain opacity-40'
                  />  
                )
              }
              {generatingImg && (
                <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                  <Loader/>
                </div>  
              )}
            </div>

          </div>

          <div className="flex mt-5 gap-5">
            <button
              type='button'
              onClick={generateImage}
              className='text-white bg-green-700 font-medium rounded-md text-sm w-full text-center py-2'
            >
              {generatingImg ? 'Generating...' : 'Generate'}
            </button>
          </div>

          <div className="mt-10">
            <p className='mt-2 text-[#666e75] text-[14px] text-center'>
              Share your creation with others in the community
            </p>

            <button 
              type='submit'
              className="mt-5 text-white bg-[#516bef] font-medium rounded-md text-sm w-full text-center py-2"
            >
              {loading ? 'sharing...' : 'Share with the community'}
            </button>
          </div>

        </form>
    </section>
  )
}
