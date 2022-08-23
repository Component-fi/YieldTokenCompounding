import {
  Modal, ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useOfac } from "@/hooks/OFAC_sdn";

interface Props {
  account?: string | null;
}

export const OFACModal: React.FC<Props> = (props) => {
  const account = props.account;
  const {isBanned} = useOfac(account || '0x0');
  console.log(isBanned);

  return (
    <>
      <Modal onClose={()=>{}} isOpen={isBanned} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ineligible Account</ModalHeader>
          <ModalBody>
            This account is not eligible to use this website.

            Our compliance filters prohibit certain wallet addresses from using this UI.
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
