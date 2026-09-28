export declare const commonStyles: Readonly<{
    fill: {
        flex: number;
    };
    center: {
        flex: number;
        justifyContent: "center";
        alignItems: "center";
    };
    absoluteAnchorBottom: {
        justifyContent: "flex-end";
        position: "absolute";
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    };
}>;
export declare const layerStyles: Readonly<{
    container: {
        flex: number;
        justifyContent: "flex-end";
    };
}>;
export declare const bottomSheetStyles: Readonly<{
    sheet: {
        overflow: "hidden";
    };
    body: {
        position: "absolute";
        top: number;
        left: number;
        right: number;
    };
    handleContainer: {
        alignItems: "center";
        paddingVertical: 10;
    };
    handle: {
        width: 36;
        height: 5;
        borderRadius: 2.5;
    };
    content: {
        paddingHorizontal: 16;
    };
}>;
export declare const confirmModalStyles: Readonly<{
    card: {
        width: "85%";
        maxWidth: 340;
        borderRadius: 16;
        padding: 20;
        shadowColor: "#000";
        shadowOffset: {
            width: number;
            height: number;
        };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
    };
    title: {
        fontSize: 18;
        fontWeight: "600";
    };
    message: {
        fontSize: 14;
        marginTop: number;
        lineHeight: number;
        textAlign: "center";
    };
    label: {
        fontSize: 13;
        color: "#6B7280";
        marginTop: number;
    };
    input: {
        borderWidth: number;
        borderColor: "#D1D5DB";
        borderRadius: 8;
        paddingHorizontal: number;
        paddingVertical: number;
        marginTop: number;
        fontSize: 15;
        color: "#111827";
    };
    buttons: {
        marginTop: number;
        flexDirection: "row";
        gap: number;
    };
    button: {
        flex: number;
        paddingVertical: number;
        borderRadius: 10;
        alignItems: "center";
    };
    buttonPressed: {
        opacity: 0.7;
    };
    buttonDisabled: {
        opacity: 0.35;
    };
    cancelText: {
        fontSize: 15;
        fontWeight: "500";
    };
    confirmText: {
        fontSize: 15;
        fontWeight: "600";
    };
}>;
export declare const alertStyles: Readonly<{
    centerCard: {
        width: "85%";
        maxWidth: 320;
        borderRadius: 16;
        padding: 20;
        shadowColor: "#000";
        shadowOffset: {
            width: number;
            height: number;
        };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
    };
    bottomSheet: {
        borderTopLeftRadius: 20;
        borderTopRightRadius: 20;
        padding: 20;
        paddingTop: number;
        shadowColor: "#000";
        shadowOffset: {
            width: number;
            height: number;
        };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
    };
    title: {
        fontSize: 18;
        fontWeight: "600";
        textAlign: "center";
    };
    message: {
        fontSize: 14;
        marginTop: number;
        lineHeight: number;
        textAlign: "center";
    };
    button: {
        marginTop: number;
        paddingVertical: number;
        borderRadius: 10;
        alignItems: "center";
    };
    buttonText: {
        fontSize: 15;
        fontWeight: "600";
    };
}>;
export declare const toastStyles: Readonly<{
    container: {
        position: "absolute";
        left: number;
        right: number;
        alignItems: "center";
        pointerEvents: "none";
    };
    pill: {
        maxWidth: 360;
        marginHorizontal: 24;
        paddingVertical: 12;
        paddingHorizontal: 18;
        borderRadius: 24;
        shadowColor: "#000";
        shadowOffset: {
            width: number;
            height: number;
        };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
    };
    text: {
        fontSize: 14;
        textAlign: "center";
    };
}>;
//# sourceMappingURL=styles.d.ts.map