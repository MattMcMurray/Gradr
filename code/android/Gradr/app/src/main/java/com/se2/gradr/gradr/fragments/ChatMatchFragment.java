package com.se2.gradr.gradr.fragments;

import android.content.Context;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import com.se2.gradr.gradr.Message;
import com.se2.gradr.gradr.R;
import com.se2.gradr.gradr.User;
import com.se2.gradr.gradr.UserAndImage;
import com.se2.gradr.gradr.helpers.GetRequester;
import com.se2.gradr.gradr.helpers.JsonConverter;
import com.se2.gradr.gradr.helpers.PostRequester;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Comparator;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link ViewMatchFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link ViewMatchFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ChatMatchFragment extends Fragment {

    private int userId;
    private String username;
    private UserAndImage match;

    private String messageStr;

    private TextView messageDisplay;
    private EditText messageBox;
    private Button sendMessage;
    private Button refreshMessages;

    private Message[] messagesArray = new Message[100];

    private OnFragmentInteractionListener mListener;

    //We call findViewById on this guy
    private View rootView;

    public ChatMatchFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param userId ID of the current signed in user
     * @param username username of the current signed in user
     * @param match a User object containing info about the match we're investigating
     * @return A new instance of fragment ViewMatchFragment.
     */
    public static ChatMatchFragment newInstance(int userId, String username, User match) {
        ChatMatchFragment fragment = new ChatMatchFragment();
        Bundle args = new Bundle();
        args.putInt("id", userId);
        args.putString("username", username);
        args.putSerializable("match", match);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            userId = getArguments().getInt("id");
            username = getArguments().getString("username");
            User currMatch = (User) getArguments().getSerializable("match");
            match = new UserAndImage(currMatch);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        rootView = inflater.inflate(R.layout.fragment_chat_match, container, false);
        messageDisplay = (TextView) rootView.findViewById(R.id.message_display);
        messageBox = (EditText) rootView.findViewById(R.id.message_box);
        sendMessage = (Button) rootView.findViewById(R.id.send_button);
        sendMessage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendMessage(v);
            }
        });
        refreshMessages = (Button) rootView.findViewById(R.id.refresh_button);
        refreshMessages.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                new GetMessagesTask().execute();
            }
        });

        populateFields();
        return rootView;
    }


    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnFragmentInteractionListener) {
            mListener = (OnFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnFragmentInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }



    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p/>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        void onFragmentInteraction(Uri uri);
    }

    public void sendMessage(View view) {
        messageStr = messageBox.getText().toString();
        new SendMessageTask().execute();
    }

    public void populateFields() {
        new GetMessagesTask().execute();
    }

    public class SendMessageTask extends AsyncTask<Void, Void, String> {
        @Override
        protected String doInBackground(Void... params) {
            String url = getString(R.string.http_address_server) + "/api/saveMessage";

            try {
                JSONObject message = new JSONObject();
                message.put("message", messageStr);
                message.put("sender", userId);
                message.put("receiver", match.getId());
                message.put("sent", true);

                String jsonString = null;
                jsonString = PostRequester.doAPostRequest(url, message);
                return jsonString;
            } catch (Exception e) {
                System.out.println("ERROR on sending message");
                System.out.println(e.toString());
                return null;
            }
        }

        @Override
        protected void onPostExecute(String json) {
            if (json == null) {
                messageBox.setText("The message was not transmitted.\n" + messageStr);
            }
            else {
                messageBox.setText("");
            }
        }
    }

    public class GetMessagesTask extends AsyncTask<Void, Void, JSONObject> {

        @Override
        protected void onPostExecute(JSONObject jsonObject) {
            try {
                messageDisplay.setText("");
                JSONArray jsonArray = jsonObject.getJSONArray("messages");
                messagesArray = new Message[jsonArray.length()];
                for (int i = 0; i < jsonArray.length(); i++) {
                    messagesArray[i] = JsonConverter.messageFromJson((JSONObject) jsonArray.get(i));
                }
                java.util.Arrays.sort(messagesArray, new Comparator<Message>() {
                    @Override
                    public int compare(Message lhs, Message rhs) {
                        return lhs.compareTo(rhs);
                    }
                });
                for (int i = 0; i < messagesArray.length; i++) {
                    if (messagesArray[i].getSender() == userId) {
                        messageDisplay.append(String.format("%s: %s\n", username, messagesArray[i].getMessage()));
                    }
                    else if (messagesArray[i].getSender() == match.getId()) {
                        messageDisplay.append(String.format("%s: %s\n", match.getUsername(), messagesArray[i].getMessage()));
                    }
                }
            } catch (Exception e) {
                System.out.println("JSON ERROR - while getting messages");
                System.out.println(e.toString());
            }
        }

        @Override
        protected JSONObject doInBackground(Void... params) {
            String url = getString(R.string.http_address_server) + "/api/getAllMessages?receiver=" + userId + "&sender=" + match.getId();
            JSONObject json = null;

            try {
                json = GetRequester.doAGetRequest(url);
            } catch (Exception e) {
                System.out.println(e.toString());
                System.out.println("ERROR on getting messages");
            }
            return json;
        }
    }
}
