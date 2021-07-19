module Main exposing (..)

import Browser
import Html exposing (br, button, div, fieldset, form, input, label, p, strong, text)
import Html.Attributes as Attributes exposing (attribute, class, name, type_, value)



-- import Html.Events exposing (onClick)


main =
    Browser.sandbox { init = 0, update = update, view = view }


type Msg
    = Increment
    | Decrement



-- update


update msg model =
    case msg of
        Increment ->
            model + 1

        Decrement ->
            model - 1



-- view


view model =
    form []
        [ div [ class "form-column" ]
            [ fieldset [ class "group group-small" ]
                [ p [ class "group__title" ]
                    [ text "Velocidad minima" ]
                , label [ class "group-option" ]
                    [ input [ name "speed", type_ "radio" ]
                        []
                    , text "Predeterminada          "
                    ]
                , label [ class "group-option" ]
                    [ input [ name "speed", type_ "radio" ]
                        []
                    , text "Personalizar          "
                    ]
                , label [ class "group-option" ]
                    [ text "Nueva velocidad:            "
                    , input [ class "custom-amount-input", attribute "disabled" "", Attributes.min "1", name "speed", type_ "number", value "20" ]
                        []
                    , text "          "
                    ]
                ]
            , fieldset [ class "group group-small" ]
                [ p [ class "group__title" ]
                    [ text "Coeficiente de errores" ]
                , label [ class "group-option" ]
                    [ input [ name "errors-coefficient", type_ "radio" ]
                        []
                    , text "Predeterminada          "
                    ]
                , label [ class "group-option" ]
                    [ input [ name "errors-coefficient", type_ "radio" ]
                        []
                    , text "Personalizar          "
                    ]
                , label [ class "group-option" ]
                    [ text "Nuevo coeficiente:            "
                    , input [ class "custom-amount-input", attribute "disabled" "", Attributes.min "1", name "errors-coefficient", type_ "number", value "2" ]
                        []
                    , text "          "
                    ]
                ]
            ]
        , div [ class "form-column" ]
            [ fieldset [ class "group group-small group-radio-only" ]
                [ p [ class "group__title" ]
                    [ text "Teclado" ]
                , label [ class "group-option" ]
                    [ input [ name "keyboard-visibility", type_ "radio" ]
                        []
                    , text "Predeterminada          "
                    ]
                , label [ class "group-option" ]
                    [ input [ name "keyboard-visibility", type_ "radio" ]
                        []
                    , text "Personalizar          "
                    ]
                , label [ class "group-option" ]
                    [ input [ name "keyboard-visibility", type_ "radio" ]
                        []
                    , text "Nunca visible          "
                    ]
                ]
            , fieldset [ class "group group-small group-radio-only" ]
                [ p [ class "group__title" ]
                    [ text "Tutor" ]
                , label [ class "group-option" ]
                    [ input [ name "tutor", type_ "radio" ]
                        []
                    , text "Predeterminada          "
                    ]
                , label [ class "group-option" ]
                    [ input [ name "tutor", type_ "radio" ]
                        []
                    , text "Personalizar          "
                    ]
                , label [ class "group-option" ]
                    [ input [ name "tutor", type_ "radio" ]
                        []
                    , text "Nunca visible          "
                    ]
                ]
            ]
        , div [ class "form-column last-form" ]
            [ fieldset [ class "group group-large" ]
                [ p [ class "group__title" ]
                    [ text "Opciones" ]
                , label [ class "group-option" ]
                    [ input [ type_ "checkbox" ]
                        []
                    , text "Bloqueo de errores          "
                    ]
                , label [ class "group-option" ]
                    [ input [ type_ "checkbox" ]
                        []
                    , text "Señal sonora, Teclas          "
                    ]
                , label [ class "group-option" ]
                    [ input [ type_ "checkbox" ]
                        []
                    , text "Señal sonora, Error          "
                    ]
                , label [ class "group-option" ]
                    [ input [ type_ "checkbox" ]
                        []
                    , text "Panel informativo"
                    , br []
                        []
                    , text "a la izquierda          "
                    ]
                , label [ class "group-option" ]
                    [ input [ type_ "checkbox" ]
                        []
                    , text "Mostrar resultados "
                    , br []
                        []
                    , text "durante la ejecución          "
                    ]
                ]
            , div [ class "buttons" ]
                [ button []
                    [ strong []
                        [ text "Aceptar" ]
                    ]
                , button []
                    [ text "Cerrar" ]
                ]
            ]
        ]
