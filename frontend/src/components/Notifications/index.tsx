import { useToast } from "@chakra-ui/toast";
import { notificationAtom } from "../../recoil/notifications/atom";
import { useRecoilValue } from "recoil";
import { useEffect } from "react";
import { Box, Link, Text } from "@chakra-ui/layout";

export const Notifications = () => {
    const notification = useRecoilValue(notificationAtom)
    const toast = useToast();

    useEffect(() => {
        if (notification.length > 0){
            const notificationLength = notification.length;
            const latestNotification = notification[notificationLength - 1];

            console.log(latestNotification);

            toast({
                position: "bottom-right",
                render: () => (
                    <NotificationBox
                        text={latestNotification.text}
                        type={latestNotification.type}
                        link={latestNotification.link}
                        linkText={latestNotification.linkText}
                        details={latestNotification.details}
                    />
                ),
            })
        }
    }, [notification, toast])

    return <></>
}

export interface NotificationBoxProps {
    text: string,
    type: "ERROR" | "SUCCESS" | "GENERAL"
    linkText?: string,
    link?: string,
    details?: string,
}

const NotificationBox: React.FC<NotificationBoxProps> = (props) => {
    const {text, type, link, linkText, details} = props;

    const color = (() => {
        switch(type){
            case "ERROR":
                return "red.300"
            case "SUCCESS":
                return "green.300"
            case "GENERAL":
                return "indigo.400"
            default:
                return "indigo.400"
        }
    })()

    return <Box color="white" p={3} bg={color}>
        <Text>
            {text}
        </Text>
        { linkText && <Link
            href={link}
            isExternal
            fontSize="xs"
            textColor="indigo.400"
        >
            {linkText}
        </Link>}
        {details && <Text>
            {details}
        </Text>}
    </Box>

}