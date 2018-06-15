// Copyright (c) 2017 Samsung Electronics Co., Ltd All Rights Reserved
// PROPRIETARY/CONFIDENTIAL 
// This software is the confidential and proprietary
// information of SAMSUNG ELECTRONICS ("Confidential Information"). You shall
// not disclose such Confidential Information and shall use it only in
// accordance with the terms of the license agreement you entered into with
// SAMSUNG ELECTRONICS. SAMSUNG make no representations or warranties about the
// suitability of the software, either express or implied, including but not
// limited to the implied warranties of merchantability, fitness for a
// particular purpose, or non-infringement. SAMSUNG shall not be liable for any
// damages suffered by licensee as a result of using, modifying or distributing
// this software or its derivatives.

using System;
using System.Collections.Generic;
using JuvoPlayer.Common;

namespace JuvoPlayer.Player
{
    public delegate void Pause();
    public delegate void Play();
    public delegate void Seek(TimeSpan time);
    public delegate void Stop();

    public interface IPlayerController : IDisposable
    {
        #region ui_slots
        void OnPause();
        void OnPlay();
        void OnSeek(TimeSpan time);
        void OnSetPlaybackRate(float rate);
        void OnStop();
        #endregion

        #region data_provider_slots
        void OnClipDurationChanged(TimeSpan duration);
        void OnDRMInitDataFound(DRMInitData data);
        void OnSetDrmConfiguration(DRMDescription description);
        void OnStreamConfigReady(StreamConfig config);
        void OnPacketReady(Packet packet);
        #endregion

        #region getters
        TimeSpan CurrentTime { get; }
        TimeSpan ClipDuration { get; }
        #endregion

        event Pause Paused;
        event Play Played;
        event Seek Seek;
        event Stop Stopped;

        event PlaybackCompleted PlaybackCompleted;
        event PlaybackError PlaybackError;
        event PlayerInitialized PlayerInitialized;
        event TimeUpdated TimeUpdated;
        event SeekCompleted SeekCompleted;
    }
}