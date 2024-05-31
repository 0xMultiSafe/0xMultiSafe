const SettingsPage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      Multisig ID: {params.id}
    </div>
  )
}

export default SettingsPage
