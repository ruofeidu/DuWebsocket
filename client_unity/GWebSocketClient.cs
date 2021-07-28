using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using NativeWebSocket;

public class GWebSocketClient : MonoBehaviour
{
    WebSocket m_WebSocket;
    String kKey = "Param";

    // Start is called before the first frame update
    async void Start()
    {
        m_WebSocket = new WebSocket("wss://g.duruofei.com");

        m_WebSocket.OnOpen += () =>
        {
            Debug.Log("Connection open!");
        };

        m_WebSocket.OnError += (e) =>
        {
            Debug.Log("Error! " + e);
        };

        m_WebSocket.OnClose += (e) =>
        {
            Debug.Log("Connection closed!");
        };

        m_WebSocket.OnMessage += (bytes) =>
        {
            // getting the message as a string
            var message = System.Text.Encoding.UTF8.GetString(bytes);
            Debug.Log("OnMessage! " + message);
        };

        // Keep sending messages at every 0.05s (20 fps) and 0.03s (33fps)
        InvokeRepeating("SetToParam", 0.0f, 0.05f);
        InvokeRepeating("GetFromParam", 0.0f, 0.03f);

        // waiting for messages
        await m_WebSocket.Connect();
    }

    void Update()
    {
#if !UNITY_WEBGL || UNITY_EDITOR
        m_WebSocket.DispatchMessageQueue();
#endif
    }

    async void SetToParam()
    {
        if (m_WebSocket.State == WebSocketState.Open)
        {
            // Sending bytes
            // await m_WebSocket.Send(new byte[] { 10, 20, 30 });

            // Sending plain text
            await m_WebSocket.SendText("set " + kKey + " " + UnityEngine.Random.Range(-10.0f, 10.0f));
        }
    }

    async void GetFromParam()
    {
        if (m_WebSocket.State == WebSocketState.Open)
        {
            // Sending bytes
            // await m_WebSocket.Send(new byte[] { 10, 20, 30 });

            // Sending plain text
            await m_WebSocket.SendText("get " + kKey);
        }
    }

    private async void OnApplicationQuit()
    {
        await m_WebSocket.Close();
    }
}
