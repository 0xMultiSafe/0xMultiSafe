import { toast } from 'sonner'

export const copy = (value: string, description = 'The address has been copied to your clipboard.') => {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        toast.success('✨ Copy Successful ✨', {
          description,
        })
      })
      .catch((err) => {
        toast.error('❌ Copy Failed ❌', {
          description: `Failed to copy your address. ${err}`,
        })
      })
  }
}
