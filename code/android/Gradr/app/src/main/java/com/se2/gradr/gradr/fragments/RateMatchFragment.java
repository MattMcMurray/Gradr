package com.se2.gradr.gradr.fragments;

import android.content.Context;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.Spinner;
import android.widget.TextView;

import com.se2.gradr.gradr.MatchListActivity;
import com.se2.gradr.gradr.R;
import com.se2.gradr.gradr.Rating;
import com.se2.gradr.gradr.User;
import com.se2.gradr.gradr.UserAndImage;
import com.se2.gradr.gradr.ViewMatchActivity;
import com.se2.gradr.gradr.helpers.GetRequester;
import com.se2.gradr.gradr.helpers.JsonConverter;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link ViewMatchFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link ViewMatchFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class RateMatchFragment extends Fragment {

    private final int RATING_OUT_OF = 5;

    private int userId;
    private String username;
    private UserAndImage match;

    private Integer[] ratingOptions;

    private OnFragmentInteractionListener mListener;

    private ArrayList<Rating> ratings;
    private ListView ratingList;
    private TextView ratingFloat;

    //We call findViewById on this guy
    private View rootView;

    public RateMatchFragment() {
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
    public static RateMatchFragment newInstance(int userId, String username, User match) {
        RateMatchFragment fragment = new RateMatchFragment();
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
        ratingOptions = new Integer[RATING_OUT_OF];
        for (int i = 0; i < RATING_OUT_OF; i++) {
            ratingOptions[i] = i+1;
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        rootView = inflater.inflate(R.layout.fragment_rate_match, container, false);
        ratingList = (ListView) rootView.findViewById(R.id.rating_list);
        ratingFloat = (TextView) rootView.findViewById(R.id.average_int);
        populateFields();
        getRatings();
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

    public void populateFields() {
        new GetRatingsTask().execute();
        Spinner ratingSpinner = (Spinner) rootView.findViewById(R.id.rating_spinner);
        ArrayAdapter<Integer> adapter = new ArrayAdapter<Integer>(rootView.getContext(),
                 android.R.layout.simple_spinner_item,  ratingOptions);
        ratingSpinner.setAdapter(adapter);

        TextView tv = (TextView) rootView.findViewById(R.id.match_name);
        tv.setText(match.getFirstName() + " " + match.getLastName());

        final Button submit = (Button) rootView.findViewById(R.id.submit_rating_button);
        submit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //TODO: POST the review

            }
        });
    }

    public void getRatings() {
        //TODO: GET the ratings for this user. Also, need to add textbox where we'll put their aggregate rating
    }



    public class RatingListAdapter extends BaseAdapter {
        Context context;
        ArrayList<Rating> ratings;
        private LayoutInflater inflater = null;

        public RatingListAdapter(Context context, ArrayList<Rating> ratings) {
            this.context = context;
            this.ratings = ratings;
            inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        }

        @Override
        public long getItemId(int position) {
            return position; //Our ratings don't really have IDs, nor do we really need them
        }

        @Override
        public Object getItem(int position) {
            return ratings.get(position);
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View view = convertView;
            if (view == null) {
                view = inflater.inflate(R.layout.rating_row, null);
            }
            Rating rating = ratings.get(position);

            TextView textView = (TextView) view.findViewById(R.id.rating_int);
            textView.setText("" + rating.getScore());

            textView = (TextView) view.findViewById(R.id.comment);
            textView.setText(rating.getComment());

            return view;
        }

        @Override
        public int getCount() {
            return ratings.size();
        }
    }




    public class GetRatingsTask extends AsyncTask<Void, Void, JSONObject> {

        /* We had to do the parsing of the rating object in the post execute because there's multiple
         * the JSON kind of contains 2 different things; the average rating and the array of comments.
         * It's ok to do this on the main thread though since we know the JSON won't be very large (max 11 elements)
         */
        @Override
        protected void onPostExecute(JSONObject json) {
            try {
                JSONArray jsonArr = json.getJSONArray("reviews");
                float average = json.getInt("average");
                ratings = new ArrayList<Rating>();
                if (average > 0) { //Otherwise, we leave it as the default "not enough ratings"
                    ratingFloat.setText("" + average);
                }

                for (int i = 0; i < jsonArr.length(); i++) {
                    Rating curr = JsonConverter.ratingFromJson((JSONObject) jsonArr.get(i));
                    ratings.add(curr);
                }
                ratingList.setAdapter(new RatingListAdapter(rootView.getContext(), ratings));
            } catch (JSONException e) {
                System.out.println("JSON ERROR - while getting ratings.");
                System.out.println(e.toString());
            }
        }

        @Override
        protected JSONObject doInBackground(Void... params) {
            String url = getString(R.string.http_address_server) + "/api/getRatings?ratee_id=" + match.getId();
//            ArrayList<User> users = new ArrayList<User>();
            JSONObject json = null;
            try {
                json = GetRequester.doAGetRequest(url);
            } catch (Exception e) {
                System.out.println(e.toString());
                System.out.println("ERROR on getting matches");
            }
            return json;
        }
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        void onFragmentInteraction(Uri uri);
    }
}
