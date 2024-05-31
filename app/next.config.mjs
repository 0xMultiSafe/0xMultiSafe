import './src/env.mjs'
import withPWA from 'next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {}

const config = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})(nextConfig)

export default nextConfig
