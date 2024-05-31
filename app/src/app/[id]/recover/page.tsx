const RecoverPage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      Multisig ID: {params.id}
    </div>
  )
}

export default RecoverPage
