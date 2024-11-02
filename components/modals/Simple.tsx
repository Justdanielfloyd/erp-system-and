import { useModal } from '@/context/ModalProvider'
import { Box, Button, Divider, Text } from '@mantine/core'
import React from 'react'
import { FaTimes } from 'react-icons/fa'
import { FaCheck } from 'react-icons/fa6'

interface SimpleProps {
    handleAction?: (() => void) | (() => Promise<void>)
    message: string
    primaryButtonLabel?: string
    secondaryButtonLabel?: string
    handleBack?: () => void | (() => Promise<void>)
    closeAfterAction?: boolean
}

const Simple: React.FC<SimpleProps> = ({
    handleAction,
    message,
    primaryButtonLabel,
    secondaryButtonLabel,
    handleBack,
    closeAfterAction,
}) => {
    const { closeModal } = useModal()
    const primaryBtnLabel = primaryButtonLabel ? primaryButtonLabel : 'Acceptar'
    const secondaryBtnLabel = secondaryButtonLabel
        ? secondaryButtonLabel
        : 'Cancel·lar'

    const action = async () => {
        if (handleAction) {
            await handleAction()
            if (closeAfterAction) {
                closeModal()
            }
        } else {
            closeModal()
        }
    }

    return (
        <Box p="md">
            <Text size="md" p={7}>
                {message}
            </Text>
            <Divider my="md" style={{ margin: '2rem 0' }} />
            <Box mt="md" display={'flex'} sx={{ justifyContent: 'center' }}>
                {handleAction && (
                    <Button
                        onClick={handleBack || closeModal}
                        color="indigo"
                        size="small"
                        mr="md"
                    >
                        <FaTimes style={{ marginRight: '5px' }} />
                        {secondaryBtnLabel}
                    </Button>
                )}
                <Button onClick={action} autoFocus color="teal" size="small">
                    <FaCheck style={{ marginRight: '5px' }} />
                    {primaryBtnLabel}
                </Button>
            </Box>
        </Box>
    )
}

export default Simple
