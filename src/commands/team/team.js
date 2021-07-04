module.exports = {
    name: "team",
    description: "Get team info",
    usage: "team <add/list> [option]",
    slash: {
        registerData: {
            guildOnly: true,
            data: {
                name: "team",
                description: "manage team",
                options: [
                    {
                        name: "member",
                        description: "Get or add team",
                        type: 2, // 2 is type SUB_COMMAND_GROUP
                        options: [
                            {
                                name: "get",
                                description: "Get team meber",
                                type: 1, // 1 is type SUB_COMMAND
                            },
                            {
                                name: "add",
                                description: "Edit permissions for a user",
                                type: 1,
                                options: [
                                    {
                                        name: "user",
                                        description: "The user to edit",
                                        type: 6,
                                        required: true,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        name: "name",
                        description: "Get or edit team name",
                        type: 2,
                        options: [
                            {
                                name: "get",
                                description: "Get team meber",
                                type: 1,
                            },
                            {
                                name: "change",
                                description: "Edit permissions for a user",
                                type: 1,
                                options: [
                                    {
                                        name: "name",
                                        description: "The user to edit",
                                        type: 3,
                                        required: true,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        },
    },
    execute({ send, client, args }) {
        if (args[0].toLower() === "add") {
            send("add")
        } else if (args[0].toLower() === "list") {
            send("list")
        }
    },
}
