port module Main exposing (..)

import Browser
import Html exposing (br, button, div, fieldset, form, input, label, p, strong, text)
import Html.Attributes as Attributes exposing (attribute, checked, class, name, pattern, style, type_, value)
import Html.Events exposing (onClick, onInput, onSubmit)
import Json.Decode as JD



-- import Html.Events exposing (onClick)


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }



-- PORTS


port sendNewSettings : Settings -> Cmd msg


port settingsReceiver : (JD.Value -> msg) -> Sub msg


port sendCloseWindow : () -> Cmd msg



-- DECODERS


type alias Settings =
    { errorsCoefficient : Float
    , timeLimitInSeconds : Int
    , isTutorGloballyActive : Maybe Bool
    , isKeyboardGloballyVisible : Maybe Bool
    }


settingsDecoder : JD.Decoder Settings
settingsDecoder =
    JD.map4 Settings
        (JD.field "errorsCoefficient" JD.float)
        (JD.field "timeLimitInSeconds" JD.int)
        (JD.maybe (JD.field "isTutorGloballyActive" JD.bool))
        (JD.maybe (JD.field "isKeyboardGloballyVisible" JD.bool))



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    settingsReceiver
        (JD.decodeValue settingsDecoder
            >> (\l ->
                    case l of
                        Ok b ->
                            SettingsReceived b

                        Err _ ->
                            SettingsReceived
                                -- TODO: TEMP
                                { errorsCoefficient = 2
                                , timeLimitInSeconds = 2
                                , isTutorGloballyActive = Nothing
                                , isKeyboardGloballyVisible = Nothing
                                }
               )
        )



-- INIT


init : () -> ( Model, Cmd Msg )
init _ =
    ( { minimumSpeed = Default
      , defaultErrorsCoefficient = False
      , isKeyboardVisible = Nothing
      , isTutorActive = Nothing
      , customMinimumSpeedAmount = 20
      , customErrorsCoefficientPercententage = "2"
      }
    , Cmd.none
    )


type CustomAmount
    = Default
    | Custom Int



-- MODEL


type alias Model =
    { minimumSpeed : CustomAmount
    , defaultErrorsCoefficient : Bool
    , customErrorsCoefficientPercententage : String
    , isTutorActive : Maybe Bool
    , isKeyboardVisible : Maybe Bool
    , customMinimumSpeedAmount : Int
    }


type Msg
    = TutorChoicePick (Maybe Bool)
    | KeyboardChoicePick (Maybe Bool)
    | PickCustomSpeed Bool
    | ChangeCustomSpeed Int
    | PickCustomErrorsCoefficient Bool
    | ChangeCustomErrorCoefficientPercentage String
    | SettingsReceived Settings
    | HandleSubmit
    | CloseWindow



-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        TutorChoicePick selection ->
            case selection of
                Just bool ->
                    ( { model | isTutorActive = Just bool }, Cmd.none )

                Nothing ->
                    ( { model | isTutorActive = Nothing }, Cmd.none )

        KeyboardChoicePick selection ->
            case selection of
                Just bool ->
                    ( { model | isKeyboardVisible = Just bool }, Cmd.none )

                Nothing ->
                    ( { model | isKeyboardVisible = Nothing }, Cmd.none )

        PickCustomSpeed bool ->
            if bool == True && model.minimumSpeed /= Default then
                ( model, Cmd.none )

            else
                ( { model
                    | minimumSpeed =
                        if bool == True then
                            Custom model.customMinimumSpeedAmount

                        else
                            Default
                  }
                , Cmd.none
                )

        ChangeCustomSpeed amount ->
            ( { model | customMinimumSpeedAmount = amount }, Cmd.none )

        PickCustomErrorsCoefficient bool ->
            ( { model | defaultErrorsCoefficient = bool }, Cmd.none )

        ChangeCustomErrorCoefficientPercentage amount ->
            ( { model | customErrorsCoefficientPercententage = amount }, Cmd.none )

        SettingsReceived settings ->
            ( { model
                | customErrorsCoefficientPercententage = String.fromFloat settings.errorsCoefficient
                , defaultErrorsCoefficient = True
                , isTutorActive = settings.isTutorGloballyActive
                , isKeyboardVisible = settings.isKeyboardGloballyVisible
              }
            , Cmd.none
            )

        HandleSubmit ->
            let
                newSettings : Settings
                newSettings =
                    { errorsCoefficient = Maybe.withDefault 2 (String.toFloat model.customErrorsCoefficientPercententage)
                    , timeLimitInSeconds = 700
                    , isTutorGloballyActive = model.isTutorActive
                    , isKeyboardGloballyVisible = model.isKeyboardVisible
                    }
            in
            ( model
            , sendNewSettings newSettings
            )

        CloseWindow ->
            ( model, sendCloseWindow () )



-- VIEW


view : Model -> Html.Html Msg
view model =
    form [ onSubmit HandleSubmit ]
        [ div [ class "form-column" ]
            [ fieldset [ class "group group-small" ]
                [ p [ class "group__title" ]
                    [ text "Velocidad minima" ]
                , label [ class "group-option" ]
                    [ input [ name "speed", type_ "radio", onClick (PickCustomSpeed False), checked (model.minimumSpeed == Default) ]
                        []
                    , text "Predeterminada"
                    ]
                , label [ class "group-option" ]
                    [ input
                        [ name "speed"
                        , type_ "radio"
                        , onClick (PickCustomSpeed True)
                        , checked
                            (model.minimumSpeed /= Default)
                        ]
                        []
                    , text "Personalizar"
                    ]
                , label [ class "group-option" ]
                    [ text "Nueva velocidad:  "
                    , if model.minimumSpeed == Default then
                        input
                            [ class "custom-amount-input"
                            , attribute "disabled" ""
                            , Attributes.min "1"
                            , name "speed"
                            , type_ "number"
                            , value (String.fromInt model.customMinimumSpeedAmount)
                            ]
                            []

                      else
                        input
                            [ class "custom-amount-input"
                            , Attributes.min "1"
                            , name "speed"
                            , type_ "number"
                            , value (String.fromInt model.customMinimumSpeedAmount)
                            , onInput (\l -> ChangeCustomSpeed (Maybe.withDefault model.customMinimumSpeedAmount (String.toInt l)))
                            ]
                            []
                    ]
                ]
            , fieldset [ class "group group-small" ]
                [ p [ class "group__title" ]
                    [ text "Coeficiente de errores" ]
                , label [ class "group-option" ]
                    [ input
                        [ name "errors-coefficient"
                        , type_ "radio"
                        , checked (model.defaultErrorsCoefficient == False)
                        , onClick (PickCustomErrorsCoefficient False)
                        ]
                        []
                    , text "Predeterminado"
                    ]
                , label [ class "group-option" ]
                    [ input
                        [ name "errors-coefficient"
                        , type_ "radio"
                        , onClick (PickCustomErrorsCoefficient True)
                        , checked
                            (model.defaultErrorsCoefficient == True)
                        ]
                        []
                    , text "Personalizar"
                    ]
                , label [ class "group-option" ]
                    [ text "Nuevo coeficiente:  "
                    , if model.defaultErrorsCoefficient == False then
                        input
                            [ class "custom-amount-input"
                            , attribute "disabled" ""
                            , Attributes.min "1"
                            , name "errors-coefficient"
                            , type_ "number"
                            , value model.customErrorsCoefficientPercententage
                            ]
                            []

                      else
                        input
                            [ class "custom-amount-input"
                            , Attributes.min "1"
                            , name "speed"
                            , type_ "text"
                            , pattern "([0-9]*[.])?[0-9]+"
                            , value model.customErrorsCoefficientPercententage
                            , onInput
                                ChangeCustomErrorCoefficientPercentage
                            ]
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
                -- , label [ class "group-option" ]
                --     [ input [ type_ "checkbox" ]
                --         []
                --     , text "Señal sonora, Teclas"
                --     ]
                -- , label [ class "group-option" ]
                --     [ input [ type_ "checkbox" ]
                --         []
                --     , text "Señal sonora, Error"
                --     ]
                -- , label [ class "group-option" ]
                --     [ input [ type_ "checkbox" ]
                --         []
                --     , text "Panel informativo"
                --     , br []
                --         []
                --     , text "a la izquierda"
                --     ]
                -- , label [ class "group-option" ]
                --     [ input [ type_ "checkbox" ]
                --         []
                --     , text "Mostrar resultados "
                --     , br []
                --         []
                --     , text "durante la ejecución"
                --     ]
                -- TODO: uncomment and add above, un-disable and add below
                , label [ class "group-option" ]
                    [ input [ type_ "checkbox", checked True, attribute "disabled" "" ]
                        []
                    , text "Mostrar resultados "
                    , br []
                        []
                    , text "durante la ejecución"
                    ]
                ]
            , fieldset [ class "group" ]
                [ p [ class "group__title" ]
                    [ text "Tiempo disponible"
                    ]
                , label [ style "display" "flex", style "flex-direction" "column", style "gap" "5px" ]
                    [ text "Minutos:"
                    , input [ type_ "number", Attributes.min "1" ]
                        []
                    ]
                ]
            , div [ class "buttons" ]
                [ button [ type_ "submit" ]
                    [ strong []
                        [ text "Aceptar" ]
                    ]
                , button [ onClick CloseWindow, type_ "button" ]
                    [ text "Cerrar" ]
                ]
            ]

        -- , text (Debug.toString model)
        ]
