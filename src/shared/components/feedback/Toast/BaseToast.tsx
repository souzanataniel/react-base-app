import {Toast, useToastState} from '@tamagui/toast'
import {YStack} from 'tamagui'

export function BaseToast() {
  const currentToast = useToastState()

  if (!currentToast || currentToast.isHandledNatively) return null

  const isError = currentToast.title?.toLowerCase().includes('erro')
  const isSuccess = currentToast.title?.toLowerCase().includes('sucesso')

  return (
    <Toast
      animation="200ms"
      key={currentToast.id}
      duration={currentToast.duration}
      viewportName={currentToast.viewportName}
      enterStyle={{opacity: 0, y: -50}}
      exitStyle={{opacity: 0, y: -20}}
      opacity={1}
      scale={1}
      theme={isError ? 'red' : isSuccess ? 'green' : 'accent'}
      width="100%"
      borderRadius="$6"
      position="absolute"
      top="50%"
      alignSelf="center"
    >
      <YStack
        alignItems="center"
        gap="$2"
        paddingHorizontal="$1"
        paddingVertical="$1"
        width="100%"
      >
        <Toast.Title fontWeight="bold" textAlign="center">
          {currentToast.title}
        </Toast.Title>
        {!!currentToast.message && (
          <Toast.Description textAlign="center">
            {currentToast.message}
          </Toast.Description>
        )}
      </YStack>
    </Toast>
  )
}
