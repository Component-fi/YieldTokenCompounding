import { Select as ChakraSelect } from '@chakra-ui/react';

export const Select: typeof ChakraSelect= (props) => {
    return <ChakraSelect
        width="40"
        rounded="full"
        variant="filled"
        bgColor="input_bg"
        cursor="pointer"
        {...props}
    >
    </ChakraSelect>
}
