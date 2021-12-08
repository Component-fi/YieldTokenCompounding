import {Button as ChakraButton} from '@chakra-ui/react';

// Redefine button with styles
export const Button: typeof ChakraButton = (props) => {
    return <ChakraButton
        rounded="full"
        bgColor="main.primary"
        color="text.secondary"
        mt="4"
        p="2"
        width="full"
        _hover={{
            bgColor:"main.primary_hover"
        }}
        {...props}
    />
}