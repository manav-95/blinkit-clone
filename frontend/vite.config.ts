import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    baseUrl: JSON.stringify("http://localhost:5000/api"),
    RAZORPAY_KEY: JSON.stringify('rzp_test_FwrSdkCJprfxIM')
  },
})
