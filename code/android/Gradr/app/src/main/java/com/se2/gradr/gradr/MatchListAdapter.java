package com.se2.gradr.gradr;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.se2.gradr.gradr.helpers.DownloadImageInBackground;

import java.util.ArrayList;

/**
 * Created by steve on 08/03/16.
 */
public class MatchListAdapter extends BaseAdapter {
    Context context;
    ArrayList<User> matches;
    private static LayoutInflater inflater = null;

    public MatchListAdapter(Context context, ArrayList<User> matches) {
        this.context = context;
        this.matches = matches;
        inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
    }

    @Override
    public long getItemId(int position) {
        return matches.get(position).getId();
    }

    @Override
    public Object getItem(int position) {
        return matches.get(position);
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View view = convertView;
        if (view == null) {
            view = inflater.inflate(R.layout.match_row, null);
        }
        User user = matches.get(position);
        ImageView imageView = (ImageView) view.findViewById(R.id.match_image);
        user.setImage(imageView);
//        if (user.hasImage()) {
//            imageView.setImageBitmap(user.getBmp());
//        } else {
//            String url = context.getString(R.string.cat_api_url) + Math.random();
//            new DownloadImageInBackground(url, user).execute(imageView);
//        }
//        String url = getString(R.string.cat_api_url) + Math.random();
//        new DownloadImageInBackground(url).execute(imageView);
//
//        User user = getItem(position);
        TextView v =(TextView) (view.findViewById(R.id.match_name));
        String name = user.getFirstName() + " " + user.getLastName();
        if (name == null || name.length() < 1) {
            name = user.getUsername();
        }
        v.setText(name);
        v = (TextView)(view.findViewById(R.id.match_school));
        v.setText(user.getSchool());
        v = (TextView)(view.findViewById(R.id.match_courses));
        v.setText(user.getCourses());

        view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //TODO: Create intent to the view match profile page
            }
        });

        return view;
    }

    @Override
    public int getCount() {
        return matches.size();
    }
}
