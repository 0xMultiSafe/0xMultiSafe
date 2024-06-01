import PendingTransactions from "@/components/common/pending-transactions"

const PendingPage = ({ params }: { params: { id: string } }) => {
  return <PendingTransactions multisig={params.id} />
}

export default PendingPage
