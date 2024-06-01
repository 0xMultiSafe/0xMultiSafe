import PendingTransactions from "@/components/common/pending-transactions"

const PendingPage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <PendingTransactions multisig={params.id} />
    </div>
  )
}

export default PendingPage
