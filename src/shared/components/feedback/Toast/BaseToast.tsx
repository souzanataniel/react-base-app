import {Toast, useToastState} from '@tamagui/toast'
import {YStack} from 'tamagui'

export function BaseToast() {
  const currentToast = useToastState()

  if (!currentToast || currentToast.isHandledNatively) return null

  const isError = currentToast.title?.toLowerCase().includes('erro')
  const isSuccess = currentToast.title?.toLowerCase().includes('sucesso')

  // ✅ Define cores manualmente
  const getColors = () => {
    if (isError) {
      return {
        background: '$button',
        titleColor: '$buttonLabel',
        descriptionColor: '$buttonLabel',
        borderColor: '$button'
      }
    }
    if (isSuccess) {
      return {
        background: '$button',
        titleColor: '$buttonLabel',
        descriptionColor: '$buttonLabel',
        borderColor: '$button'
      }
    }
    return {
      background: '$button',
      titleColor: '$buttonLabel',
      descriptionColor: '$buttonLabel',
      borderColor: '$button'
    }
  }

  const colors = getColors()

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
      width="100%"
      borderRadius="$4"
      position="absolute"
      top="50%"
      alignSelf="center"
      backgroundColor={colors.background}
      borderWidth={1}
      borderColor={colors.borderColor}
      shadowColor="$shadowColor"
      shadowRadius={8}
      shadowOffset={{width: 0, height: 2}}
      elevation={3}
    >
      <YStack
        alignItems="center"
        gap="$2"
        paddingHorizontal="$4"
        paddingVertical="$3"
        width="100%"
      >
        <Toast.Title
          fontWeight="bold"
          textAlign="center"
          color={colors.titleColor}
        >
          {currentToast.title}
        </Toast.Title>
        {!!currentToast.message && (
          <Toast.Description
            textAlign="center"
            color={colors.descriptionColor}
          >
            {currentToast.message}
          </Toast.Description>
        )}
      </YStack>
    </Toast>
  )
}
