var testtabledata = [
    {
        id: 1,
        name: "Oli Bob",
        email: "email",
        event: "Екзамен взрос",
        dateEvent: "14/12/2018",
        timeEvent: "11:00",
        dateSign: "4/12/2018",
        timeSign: "10:23"
    },
    {
        id: 3,
        name: " Bob",
        email: "email",
        event: "[7-11 лет] Вступительный тест",
        dateEvent: "15/12/2018",
        timeEvent: "12:00",
        dateSign: "5/12/2018",
        timeSign: "11:23"
    },
    {
        id: 4,
        name: "Oli",
        email: "email",
        event: "event",
        dateEvent: "16/12/2018",
        timeEvent: "10:00",
        dateSign: "4/12/2018",
        timeSign: "10:23"
    },

    {
        id: 10,
        name: "Jek",
        email: "email",
        event: "[7-11 лет] Вступительный тест",
        dateEvent: "14/12/2018",
        timeEvent: "11:00",
        dateSign: "4/12/2018",
        timeSign: "10:23"
    },

];
table.setData(testtabledata);

var testjson = {
    "users": {
        "shp1p": {
            "toplevel": {
                "title": "Школа программирования Ш++",
                "description": "Добро пожаловать! Выберите, пожалуйста, удобную для вас дату и время",
                "endmessage": "Спасибо за регистрацию!"
            },
            "timezone": "GMT+3",
            "types": {
                "grownups": {
                    "path": "exam",
                    "color": "#00ffff",
                    "rangeDays": 15,
                    "canCancel": true,
                    "cancellationPolicy": "...",
                    "XredirectOnConfirmation": "http://....",
                    "XwebhookUrl": "http://....{{}}",
                    "enabled": true,
                    "secret": false,
                    "form": {
                        "fields": [
                            {
                                "type": "text",
                                "label": "Имя И фамилия",
                                "regex": ".+ .+",
                                "minLen": 5
                            },
                            {
                                "type": "text",
                                "label": "email",
                                "regex": ".*@.*\\..*"
                            }
                        ]
                    },
                    "title": "[7-11 лет] Вступительный тест",
                    "location": "Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж",
                    "description": "Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз",
                    "durationMinutes": 120,
                    "concurrentVisitors": 2,
                    "override": {
                        "exactday": {
                            "2018.11.11": {
                                "slots": []
                            },
                            "2018.11.12": {
                                "reuse": "2018.11.11"
                            }
                        }
                    },
                    "recurring": {
                        "weekly": {
                            "days": [
                                {
                                    "slots": [
                                        {
                                            "time": "10:00"
                                        },
                                        {
                                            "time": "11:00"
                                        },
                                        {
                                            "time": "12:00"
                                        },
                                        {
                                            "time": "13:00"
                                        },
                                        {
                                            "time": "14:00"
                                        },
                                        {
                                            "time": "15:00"
                                        },
                                        {
                                            "time": "16:00"
                                        },
                                        {
                                            "time": "17:00"
                                        }
                                    ]
                                },
                                {
                                    "reuse": 0
                                },
                                {
                                    "reuse": 0
                                },
                                {
                                    "reuse": 0
                                },
                                {
                                    "reuse": 0
                                },
                                {
                                    "slots": [
                                        {
                                            "time": "11:00"
                                        },
                                        {
                                            "time": "12:00"
                                        },
                                        {
                                            "time": "13:00"
                                        },
                                        {
                                            "time": "14:00"
                                        },
                                        {
                                            "time": "15:00"
                                        },
                                        {
                                            "time": "16:00"
                                        }
                                    ]
                                },
                                {}
                            ]
                        }
                    }
                }
            }
        }
    }
};
