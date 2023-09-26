import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { register as registerUser, reset } from '../features/auth/authSlice'
import { openAuth } from '../features/ui/uiSlice'
import { toast } from 'react-toastify'
import Logo from '../assets/Logo.webp'
import BGImage from '../assets/registerBg.webp'
import { urlPattern } from '../constants/pattern'
import { Oval } from 'react-loader-spinner'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const schema = z.object({
  name: z
    .string()
    .nonempty({ message: 'Name is required' })
    .min(3, { message: 'Name must be at least 3 characters' }),
  email: z
    .string()
    .min(1, { message: 'Please enter a email address' })
    .email('Please enter a valid email address'),
  companyWebsite:z
    .string()
    .url('Please enter a valid url')
    .optional(),
  companyLocation:z
    .string()
    .nonempty({ message: 'Company location is required' }),
  companyDescription: z
    .string()
    .nonempty({message:'Company description is required'})
    .min(20, { message: 'Description need to have at least 20 Charters' })
    .max(500, { message: 'Description is too long' })
    .email('Please enter a valid email address'),    
})

const CompanySignUp = () => {
  const [imageload, setImageLoad] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ resolver: zodResolver(schema) })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  const onSubmit = (data) => {
    data.userRole = 'company'
    dispatch(registerUser(data))
  }

  useEffect(() => {
    if (isError) {
      toast.error(message, { theme: 'dark' })
    }

    if (isSuccess && !isLoading && !isError && !user) {
      window.location.href = '/'
    }

    dispatch(reset())
  }, [user, isError, isLoading, isSuccess, message, dispatch])

  return (
    <div className='grid grid-cols-8 w-screen h-screen'>
      <div className='col-span-8 lg:col-span-5 w-full font-[Mulish]'>
        <div className='w-10/12 md:w-2/3 mx-auto pt-9 pb-6'>
          <div className='flex items-center gap-x-2 md:mr-12 lg:mr-16 cursor-pointer'>
            <img src={Logo} alt='website-logo' className='w-14' />
            <p className='text-4xl font-bold text-black font-[Domine]'>
              Jobs.lk
            </p>
          </div>

          <div className='mt-4 mb-6 '>
            <p className='font-bold text-xl'>Create an employer account</p>
            <span className='text-sm text-[#757575]'>
              You haven’t posted a job before, so you’ll need to create an
              employer account.
            </span>
          </div>

          <form
            className='grid grid-cols-6 gap-3'
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className='col-span-6 sm:col-span-3'>
              <label htmlFor='company-name' className='input-label'>
                Company name
              </label>
              <input
                type='text'
                {...register('name')}
                className='input-field'
                placeholder='company name'
              />
              {errors.name && (
                <p className='text-xs text-red-500 pt-0.5'>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className='col-span-6 sm:col-span-3'>
              <label htmlFor='company-email' className='input-label'>
                Company email
              </label>
              <input
                type='email'
                {...register('email')}
                className='input-field'
                placeholder='company email'
              />
              {errors.email && (
                <p className='text-xs text-red-500 pt-0.5'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className='col-span-6'>
              <label htmlFor='company-website' className='input-label'>
                Company website{' '}
                <span className='text-[#333333]/50'>(optional)</span>
              </label>
              <input
                type='text'
                {...register('companyWebsite')}
                className='input-field'
                placeholder='company website url'
              />
              {errors.companyWebsite && (
                <p className='text-xs text-red-500 pt-0.5'>
                  {errors.companyWebsite.message}
                </p>
              )}
            </div>

            <div className='col-span-6'>
              <label htmlFor='company-location' className='input-label'>
                Company location
              </label>
              <input
                type='text'
                {...register('companyLocation')}
                className='input-field'
                placeholder='company location'
              />
              {errors.companyLocation && (
                <p className='text-xs text-red-500 pt-0.5'>
                  {errors.companyLocation.message}
                </p>
              )}
            </div>

            <div className='col-span-6'>
              <label
                htmlFor='company-employees'
                className='block text-sm font-medium text-gray-700'
              >
                Company's number of employees
              </label>
              <select
                id='company-employees'
                {...register('numberOfEmployees', {
                  required: 'Please select the value',
                })}
                className='input-field'
              >
                <option>1 to 49</option>
                <option>50 to 149</option>
                <option>150 to 249</option>
                <option>250 to 499</option>
                <option>500 to 749</option>
                <option>750 to 999</option>
                <option>1000+</option>
              </select>
              {errors.numberOfEmployees && (
                <p className='text-xs text-red-500 pt-0.5'>
                  {errors.numberOfEmployees.message}
                </p>
              )}
            </div>

            <div className='col-span-6'>
              <label htmlFor='company-description' className='input-label'>
                Company description
              </label>
              <textarea
                {...register('companyDescription')}
                rows='3'
                className='input-field'
                placeholder='company description'
              />
              {errors.companyDescription && (
                <p className='text-xs text-red-500 pt-0.5'>
                  {errors.companyDescription.message}
                </p>
              )}
            </div>

            <div className='col-span-6'>
              <label htmlFor='company-password' className='input-label'>
                Password
              </label>
              <input
                type='password'
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className='input-field'
                placeholder='**********'
              />
              {errors.password && (
                <p className='text-xs text-red-500 pt-0.5'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className='col-span-6'>
              <label htmlFor='company-repassword' className='input-label'>
                Confirm password
              </label>
              <input
                type='password'
                {...register('confirm_password', {
                  required: 'Confirm password is required',
                  validate: (val) => {
                    if (watch('password') !== val) {
                      return 'Passwords do no match'
                    }
                  },
                })}
                className='input-field'
                placeholder='**********'
              />
              {errors.confirm_password && (
                <p className='text-xs text-red-500 pt-0.5'>
                  {errors.confirm_password.message}
                </p>
              )}
            </div>

            <button
              type='submit'
              className={`mt-4 col-span-6 bg-black text-white rounded-lg w-full ${
                isLoading ? 'py-1' : 'py-3'
              } hover:bg-gray-700 flex items-center justify-center`}
            >
              {isLoading ? (
                <Oval
                  height={30}
                  width={30}
                  color='#fff'
                  secondaryColor='lightgray'
                  strokeWidth={6}
                  strokeWidthSecondary={6}
                />
              ) : (
                'Create an Account'
              )}
            </button>
            <p className='col-span-6 text-sm w-full text-center font-bold text-[#6B7E8B]'>
              If you have an account?
              <span
                className='text-[#625BF7] cursor-pointer'
                onClick={() => {
                  navigate('/')
                  dispatch(openAuth(true))
                }}
              >
                {' '}
                Sign in
              </span>
            </p>
          </form>
        </div>
      </div>
      <div className='hidden lg:block col-span-3 w-full relative overflow-hidden'>
        <img
          src={BGImage}
          alt='right-bg'
          loading='lazy'
          onLoad={() => setImageLoad(false)}
          className={`absolute inset-0 w-full h-full object-cover duration-700 ease-in-out ${
            imageload
              ? 'grayscale blur-lg scale-105'
              : 'grayscale-0 blur-0 scale-100'
          }`}
        />
      </div>
    </div>
  )
}

export default CompanySignUp
