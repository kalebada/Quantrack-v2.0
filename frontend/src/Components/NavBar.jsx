import { Link } from 'react-router-dom';
import logo from '../assets/logo.webp';

const NavBar = () => {
  return (
    <div className='bg-zinc-900 w-full flex justify-between items-center px-4 py-2 lg:py-0 text-black sticky top-0 border-b border-zinc-500'>
        <a href='/' className='flex items-center'>
        <img src={logo} className='w-[20%] lg:w-[8%]'/>
        <h1 className='text-white font-[Gued] text-2xl lg:text-3xl'>Quantrack</h1>
        </a>
        <div className='flex items-center gap-4 font-[montserrat] text-sm text-white'>
            <Link to='/verify-email' className='px-4 py-1 border border-[#9B4DFF] rounded cursor-pointer lg:hover:bg-[#9B4DFF] transition-all duration-200'>Verify</Link> 
            <Link to='/login' className='px-4 py-1 border border-[#9B4DFF] rounded cursor-pointer lg:hover:bg-[#9B4DFF] transition-all duration-200'>Login</Link> 
        </div>
    </div>
  )
}

export default NavBar;