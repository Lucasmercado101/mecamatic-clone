module Main exposing (..)

import Browser
import Html exposing (br, button, div, fieldset, form, input, label, p, strong, text)
import Html.Attributes as Attributes exposing (attribute, checked, class, name, type_, value)
import Html.Events exposing (onClick)



-- import Html.Events exposing (onClick)


main : Program () Model Msg
main =
    Browser.sandbox { init = init, update = update, view = view }



-- INIT


init : Model
init =
    { minimumSpeed = Default
    , errorsCoefficient = Default
    , isKeyboardVisible = Nothing
    , isTutorActive = Nothing
    }


type WhenIsItActive
    = Predetermined
    | Always
    | Never


type CustomAmount
    = Default
    | DefineCustom
    | Custom Int



-- MODEL


type alias Model =
    { minimumSpeed : CustomAmount
    , errorsCoefficient : CustomAmount
    , isTutorActive : Maybe Bool
    , isKeyboardVisible : Maybe Bool
    }


type Msg
    = TutorChoicePick (Maybe Bool)
    | KeyboardChoicePick (Maybe Bool)



-- UPDATE


update : Msg -> Model -> Model
update msg model =
    case msg of
        TutorChoicePick selection ->
            case selection of
                Just bool ->
                    { model | isTutorActive = Just bool }

                Nothing ->
                    { model | isTutorActive = Nothing }

        KeyboardChoicePick selection ->
            case selection of
                Just bool ->
                    { model | isKeyboardVisible = Just bool }

                Nothing ->
                    { model | isKeyboardVisible = Nothing }



-- view


view : Model -> Html.Html Msg
view model =
    form []
        [ div [ class "form-column" ]
            [ fieldset [ class "group group-small" ]
                [ p [ class "group__title" ]
                    [ text "Velocidad minima" ]
                , label [ class "group-option" ]
                    [ input [ name "speed", type_ "radio" ]
                        []
                    , text "Predeterminada"
                    ]
                , label [ class "group-option" ]
                    [ input [ name "speed", type_ "radio" ]
                        []
                    , text "Personalizar"
                    ]
                , label [ class "group-option" ]
                    [ text "Nueva velocidad:  "
                    , input [ class "custom-amount-input", attribute "disabled" "", Attributes.min "1", name "speed", type_ "number", value "20" ]
                        []
                    ]
                ]
            , fieldset [ class "group group-small" ]
                [ p [ class "group__title" ]
                    [ text "Coeficiente de errores" ]
                , label [ class "group-option" ]
                    [ input [ name "errors-coefficient", type_ "radio" ]
                        []
                    , text "Predeterminada"
                    ]
                , label [ class "group-option" ]
                    [ input [ name "errors-coefficient", type_ "radio" ]
                        []
                    , text "Personalizar"
                    ]
                , label [ class "group-option" ]
                    [ text "Nuevo coeficiente:  "
                    , input [ class "custom-amount-input", attribute "disabled" "", Attributes.min "1", name "errors-coefficient", type_ "number", value "2" ]
                        []
                    ]
                ]
            ]
        , div [ class "form-column" ]
            [ fieldset [ class "group group-small group-radio-only" ]
                [ p [ class "group__title" ]
                    [ text "Teclado" ]
                , label [ class "group-option" ]
                    [ input [ name "keyboard-visibility", type_ "radio", onClick (KeyboardChoicePick Nothing), checked (model.isKeyboardVisible == Nothing) ]
                        []
                    , text "Predeterminado"
                    ]
                , label [ class "group-option" ]
                    [ input [ name "keyboard-visibility", type_ "radio", onClick (KeyboardChoicePick (Just True)), checked (model.isKeyboardVisible == Just True) ]
                        []
                    , text "Siempre visible"
                    ]
                , label [ class "group-option" ]
                    [ input [ name "keyboard-visibility", type_ "radio", onClick (KeyboardChoicePick (Just False)), checked (model.isKeyboardVisible == Just False) ]
                        []
                    , text "Nunca visible"
                    ]
                ]
            , fieldset [ class "group group-small group-radio-only" ]
                [ p [ class "group__title" ]
                    [ text "Tutor" ]
                , label [ class "group-option" ]
                    [ input [ name "tutor", type_ "radio", onClick (TutorChoicePick Nothing), checked (model.isTutorActive == Nothing) ]
                        []
                    , text "Predeterminado"
                    ]
                , label [ class "group-option" ]
                    [ input [ name "tutor", type_ "radio", onClick (TutorChoicePick (Just True)), checked (model.isTutorActive == Just True) ]
                        []
                    , text "Siempre activo"
                    ]
                , label [ class "group-option" ]
                    [ input [ name "tutor", type_ "radio", onClick (TutorChoicePick (Just False)), checked (model.isTutorActive == Just False) ]
                        []
                    , text "Nunca activo"
                    ]
                ]
            ]
        , div [ class "form-column last-form" ]
            [ fieldset [ class "group group-large" ]
                [ p [ class "group__title" ]
                    [ text "Opciones" ]

                -- , label [ class "group-option" ]
                --     [ input [ type_ "checkbox" ]
                --         []
                --     , text "Bloqueo de errores"
                --     ]
                , label [ class "group-option" ]
                    [ input [ type_ "checkbox" ]
                        []
                    , text "Señal sonora, Teclas"
                    ]
                , label [ class "group-option" ]
                    [ input [ type_ "checkbox" ]
                        []
                    , text "Señal sonora, Error"
                    ]
                , label [ class "group-option" ]
                    [ input [ type_ "checkbox" ]
                        []
                    , text "Panel informativo"
                    , br []
                        []
                    , text "a la izquierda"
                    ]
                , label [ class "group-option" ]
                    [ input [ type_ "checkbox" ]
                        []
                    , text "Mostrar resultados "
                    , br []
                        []
                    , text "durante la ejecución"
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
        , text (Debug.toString model)
        ]
