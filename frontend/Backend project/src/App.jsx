import { useState } from 'react'
import axios from "axios";
import './App.css'

function App() {
  const [avatar, setAvatar] = useState()
  const [coverImage, setCoverImage] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [username, setUsername] = useState()
  
  const [fullName, setfullName] = useState()
  
  const upload = () => {
    const formData = new FormData()
    formData.append('avatar',avatar)
    formData.append('coverImage',coverImage)
    formData.append('email',email)
    formData.append('fullName',fullName)
    formData.append('username',username)
    formData.append('password',password)
    axios.post('http://localhost:8000/api/v1/users/register',formData)
    .then(res=>{console.log(res);})
    .catch((err)=>{console.log("Please provide information correctly")});

  }

  return (
    <>
      <div>
          <input type = "file" onChange = {(e)=>setAvatar(e.target.files[0])} placeholder='Your Avatar'/>
          <input type = "file" onChange = {(e)=>setCoverImage(e.target.files[0])} placeholder='Your Cover Image'/>
          <input type = "text" placeholder='Your full name' onChange={(e)=>{setFullName(e.target.value)}}/>
          
          <input type = "text" placeholder='Your email' onChange={(e)=>{setEmail(e.target.value)}}/>
          
          <input type = "text" placeholder='Your password' onChange={(e)=>{setPassword(e.target.value)}}/>
          
          <input type = "text" placeholder='Your Username' onChange={(e)=>{setUsername(e.target.value)}}/>
          <button type = "button" onClick = {upload}>Upload</button>
        
      </div>
    </>
  )
}

export default App
